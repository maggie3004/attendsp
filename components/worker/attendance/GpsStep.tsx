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
    <div className="card flex flex-col items-center gap-6 p-6 text-center sm:p-8">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</div>
        <span>Verifying your location</span>
      </div>

      <motion.div
        animate={status === 'acquiring' ? { scale: [1, 1.06, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={cn('flex h-20 w-20 items-center justify-center rounded-full', status === 'acquiring' && 'bg-blue-50', status === 'success' && 'bg-emerald-50', status === 'error' && 'bg-rose-50')}
      >
        {status === 'acquiring' && <Loader2 className="h-8 w-8 animate-spin text-blue-600" />}
        {status === 'success' && <CheckCircle2 className="h-8 w-8 text-emerald-600" />}
        {status === 'error' && <AlertCircle className="h-8 w-8 text-rose-600" />}
      </motion.div>

      <div>
        {status === 'acquiring' && (
          <>
            <h2 className="text-lg font-semibold text-slate-900">Acquiring GPS signal</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Please hold your phone still while we confirm your location.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h2 className="text-base font-semibold text-emerald-600">Location confirmed</h2>
            {accuracyInfo && <p className={cn('mt-1 text-sm', accuracyInfo.color)}>{accuracyInfo.label} (±{accuracy}m)</p>}
          </>
        )}
        {status === 'error' && (
          <>
            <h2 className="text-lg font-semibold text-rose-600">Location needs attention</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">{errorMsg}</p>
          </>
        )}
      </div>

      {isOffline && (
        <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
          <WifiOff className="h-3.5 w-3.5" />
          Offline mode — your check-in will sync when connected
        </div>
      )}

      {status === 'error' && (
        <button onClick={() => setError(errorMsg ?? 'Location error')} className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
          Retry
        </button>
      )}
    </div>
  )
}
