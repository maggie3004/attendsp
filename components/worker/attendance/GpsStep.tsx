'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Loader2, AlertCircle, CheckCircle2, WifiOff } from 'lucide-react'
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
        // Advance to camera after 1.2s
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
      <div className="flex items-center gap-2 text-xs text-foreground/40">
        <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center text-white font-bold">1</div>
        <span>Getting GPS Location</span>
      </div>

      {/* Icon */}
      <div className="relative">
        <motion.div
          animate={status === 'acquiring' ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={cn(
            'w-20 h-20 rounded-full flex items-center justify-center',
            status === 'acquiring' && 'bg-brand/10',
            status === 'success' && 'bg-emerald-500/10',
            status === 'error' && 'bg-red-500/10',
          )}
        >
          {status === 'acquiring' && <Loader2 className="w-8 h-8 text-brand animate-spin" />}
          {status === 'success' && <CheckCircle2 className="w-8 h-8 text-emerald-400" />}
          {status === 'error' && <AlertCircle className="w-8 h-8 text-red-400" />}
        </motion.div>
      </div>

      {/* Status text */}
      <div>
        {status === 'acquiring' && (
          <>
            <h2 className="text-lg font-semibold">Acquiring GPS Signal</h2>
            <p className="text-sm text-foreground/50 mt-1">Please stay still for a moment...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-lg font-semibold text-emerald-400">Location Found</h2>
            {accuracyInfo && (
              <p className={cn('text-sm mt-1', accuracyInfo.color)}>
                {accuracyInfo.label} (±{accuracy}m)
              </p>
            )}
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-lg font-semibold text-red-400">Location Error</h2>
            <p className="text-sm text-foreground/50 mt-1">{errorMsg}</p>
          </>
        )}
      </div>

      {/* Offline badge */}
      {isOffline && (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl">
          <WifiOff className="w-3.5 h-3.5" />
          Offline mode — will sync when connected
        </div>
      )}

      {/* Retry button on error */}
      {status === 'error' && (
        <button
          onClick={() => setError(errorMsg ?? 'Location error')}
          className="px-6 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-sm text-foreground/70 hover:text-foreground transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}
