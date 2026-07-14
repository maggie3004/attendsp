'use client'

import { motion } from 'framer-motion'
import { useAttendanceStore } from '@/store/attendanceStore'
import { Fingerprint, ShieldCheck } from 'lucide-react'

export function AttendanceButton() {
  const { setStep } = useAttendanceStore()

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setStep('gps')}
        className="flex w-full max-w-sm items-center justify-center gap-4 rounded-2xl bg-brand px-6 py-5 text-white shadow-lg shadow-brand/25 transition hover:bg-brand-600"
        aria-label="Mark Attendance"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
          <Fingerprint className="h-7 w-7" />
        </div>
        <div className="text-left">
          <div className="text-lg font-semibold">Mark attendance</div>
          <div className="text-sm text-white/80">Secure check-in with face and GPS</div>
        </div>
      </motion.button>

      <div className="flex items-center gap-2 rounded-full border border-surface-border bg-white px-3 py-2 text-xs font-medium text-foreground-muted">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        Camera and GPS access required
      </div>
    </div>
  )
}
