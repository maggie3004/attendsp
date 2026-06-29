'use client'

import { motion } from 'framer-motion'
import { useAttendanceStore } from '@/store/attendanceStore'
import { Fingerprint } from 'lucide-react'

export function AttendanceButton() {
  const { setStep } = useAttendanceStore()

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Pulse ring button */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setStep('gps')}
        className="relative w-48 h-48 rounded-full gradient-brand shadow-glow animate-pulse-ring flex flex-col items-center justify-center gap-3 text-white"
        aria-label="Mark Attendance"
      >
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border-2 border-brand/30 scale-110" />
        <div className="absolute inset-0 rounded-full border border-brand/15 scale-125" />

        <Fingerprint className="w-16 h-16 drop-shadow-lg" />
        <span className="text-sm font-semibold tracking-wide">Mark Attendance</span>
      </motion.button>

      <p className="text-xs text-foreground/30 text-center max-w-48">
        Tap to begin. Camera and GPS access required.
      </p>
    </div>
  )
}
