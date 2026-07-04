'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useAttendanceStore } from '@/store/attendanceStore'
import { GpsStep } from '@/components/worker/attendance/GpsStep'
import { CameraStep } from '@/components/worker/attendance/CameraStep'
import { VerifyingStep } from '@/components/worker/attendance/VerifyingStep'
import { SuccessStep } from '@/components/worker/attendance/SuccessStep'
import { ErrorStep } from '@/components/worker/attendance/ErrorStep'
import { AttendanceButton } from '@/components/worker/attendance/AttendanceButton'
import { formatDate, formatTime } from '@/lib/utils'
import { CalendarCheck, MapPin, Clock } from 'lucide-react'

export default function WorkerAttendancePage() {
  const { data: session } = useSession()
  const { step, reset } = useAttendanceStore()

  const { setIsOffline } = useAttendanceStore()
  useEffect(() => {
    const update = () => setIsOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    update()
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [setIsOffline])

  const now = new Date()

  return (
    <div className="flex flex-col min-h-full px-4 pt-6 pb-4 bg-[#f8f9fb]">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-xl font-bold text-gray-900">
          Hello, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <div className="flex items-center gap-4 mt-1.5 text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4" />
            {formatDate(now, 'EEE, dd MMM yyyy')}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {formatTime(now)}
          </div>
        </div>
      </motion.div>

      {/* Main flow */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center gap-8"
            >
              <TodayStatusCard />
              <AttendanceButton />
            </motion.div>
          )}

          {step === 'gps' && (
            <motion.div key="gps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
              <GpsStep />
            </motion.div>
          )}

          {step === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full">
              <CameraStep />
            </motion.div>
          )}

          {(step === 'verifying' || step === 'saving') && (
            <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
              <VerifyingStep />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
              <SuccessStep />
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full">
              <ErrorStep onRetry={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TodayStatusCard() {
  return (
    <div className="w-full card p-4 flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-gray-50">
        <MapPin className="w-4 h-4 text-gray-400" />
      </div>
      <div>
        <div className="text-xs text-gray-400">Today&apos;s Status</div>
        <div className="text-sm font-medium text-gray-700">Not yet marked</div>
      </div>
      <div className="ml-auto px-2.5 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs text-gray-500">
        Pending
      </div>
    </div>
  )
}
