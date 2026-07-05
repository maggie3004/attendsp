'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, CheckCircle2, WifiOff } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'
import { getCurrentPosition, getGpsErrorMessage, getGpsAccuracyStatus } from '@/lib/gps'
import { cn } from '@/lib/utils'

export function GpsStep() {
  const { setStep, setGpsData, setError, isOffline } = useAttendanceStore()
  const [status, setStatus] = useState<'waiting' | 'acquiring' | 'success' | 'error'>('waiting')
  const [accuracy, setAccuracy] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    setStatus('acquiring')
    getCurrentPosition({ enableHighAccuracy: true, timeout: 15000 })
      .then((pos) => {
        const acc = Math.round(pos.coords.accuracy)
        setAccuracy(acc)
        setStatus('success')
        setGpsData({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: acc,
          timestamp: pos.timestamp,
        })
        setTimeout(() => setStep('camera'), 1200)
      })
      .catch((err: GeolocationPositionError) => {
        const msg = getGpsErrorMessage(err)
        setErrorMsg(msg)
        setStatus('error')
      })
  }, [setGpsData, setStep])

  const accuracyInfo = accuracy !== null ? getGpsAccuracyStatus(accuracy) : null

  return (
    <div className="card p-8 flex flex-col items-center gap-6 text-center">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
        <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-white font-bold text-xs">1</div>
        <span>Getting GPS Location</span>
      </div>

      {/* Icon */}
      <motion.div
        animate={status === 'acquiring' ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={cn(
          'w-20 h-20 rounded-full flex items-center justify-center',
          status === 'acquiring' && 'bg-indigo-50',
          status === 'success' && 'bg-green-50',
          status === 'error' && 'bg-red-50',
        )}
      >
        {status === 'acquiring' && <Loader2 className="w-8 h-8 text-brand animate-spin" />}
        {status === 'success' && <CheckCircle2 className="w-8 h-8 text-green-500" />}
        {status === 'error' && <AlertCircle className="w-8 h-8 text-red-500" />}
      </motion.div>

      {/* Status text */}
      <div>
        {status === 'acquiring' && (
          <>
            <h2 className="text-lg font-bold text-slate-900">Acquiring GPS Signal</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Please stay still for a moment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-base font-semibold text-green-600">Location Found</h2>
            {accuracyInfo && (
              <p className={cn('text-sm mt-1', accuracyInfo.color)}>
                {accuracyInfo.label} (±{accuracy}m)
              </p>
            )}
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-lg font-bold text-red-500">Location Error</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">{errorMsg}</p>
          </>
        )}
      </div>

      {/* Offline badge */}
      {isOffline && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
          <WifiOff className="w-3.5 h-3.5" />
          Offline mode — will sync when connected
        </div>
      )}

      {/* Retry button on error */}
      {status === 'error' && (
        <button
          onClick={() => setError(errorMsg ?? 'Location error')}
          className="px-6 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
