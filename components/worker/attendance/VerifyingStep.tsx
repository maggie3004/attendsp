'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ScanFace, MapPin, Save } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'
import { useSession } from 'next-auth/react'
import { useOfflineQueueStore } from '@/store/attendanceStore'

const STEPS = [
  { key: 'face', label: 'Verifying face identity', icon: ScanFace },
  { key: 'gps', label: 'Confirming location', icon: MapPin },
  { key: 'save', label: 'Saving attendance', icon: Save },
]

export function VerifyingStep() {
  const { data: session } = useSession()
  const { step, capturedImage, gpsData, setStep, setMatchedSite, setError, isOffline } = useAttendanceStore()
  const { addToQueue } = useOfflineQueueStore()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function verify() {
      if (!capturedImage || !gpsData || !session?.user?.id) {
        setError('Missing attendance data. Please try again.')
        return
      }

      if (isOffline) {
        const checksum = Buffer.from(
          `${session.user.id}-${gpsData.timestamp}`
        ).toString('base64')
        addToQueue({
          userId: session.user.id,
          captureImage: capturedImage,
          gpsData,
          timestamp: gpsData.timestamp,
          deviceId: navigator.userAgent.slice(0, 50),
          checksum,
        })
        setStep('success')
        return
      }

      try {
        const response = await fetch('/api/attendance/mark', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            captureImage: capturedImage,
            latitude: gpsData.latitude,
            longitude: gpsData.longitude,
            accuracy: gpsData.accuracy,
            timestamp: gpsData.timestamp,
            isOffline: false,
          }),
        })

        const data = await response.json()

        if (!response.ok || !data.success) {
          setError(data.error ?? 'Attendance verification failed. Please try again.')
          return
        }

        if (data.data?.site) {
          setMatchedSite({
            siteId: data.data.site.id,
            siteName: data.data.site.name,
            distanceMeters: data.data.distanceMeters ?? 0,
            isWithin: true,
          })
        }

        setStep('success')
      } catch {
        if (!navigator.onLine) {
          setError('No internet connection. Please enable WiFi and try again, or wait for offline sync.')
        } else {
          setError('Server error. Please try again in a moment.')
        }
      }
    }

    verify()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const currentStepIndex = step === 'verifying' ? 0 : step === 'saving' ? 2 : 1

  return (
    <div className="card p-8 flex flex-col items-center gap-8 text-center">
      <div>
        <h2 className="text-base font-semibold text-gray-800">Verifying Attendance</h2>
        <p className="text-sm text-gray-400 mt-1">Almost done, please wait...</p>
      </div>

      {/* Progress steps */}
      <div className="w-full space-y-4">
        {STEPS.map(({ key, label, icon: Icon }, index) => {
          const isDone = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="flex items-center gap-4"
            >
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500
                ${isDone ? 'bg-green-50 border border-green-200' : ''}
                ${isCurrent ? 'bg-indigo-50 border border-indigo-200' : ''}
                ${!isDone && !isCurrent ? 'bg-gray-50 border border-gray-200' : ''}
              `}>
                {isCurrent ? (
                  <Loader2 className="w-4 h-4 text-brand animate-spin" />
                ) : isDone ? (
                  <Icon className="w-4 h-4 text-green-500" />
                ) : (
                  <Icon className="w-4 h-4 text-gray-300" />
                )}
              </div>
              <div className="text-left">
                <p className={`text-sm font-medium ${isDone ? 'text-green-600' : isCurrent ? 'text-gray-800' : 'text-gray-300'}`}>
                  {label}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
