'use client'

import { motion } from 'framer-motion'
import { useAttendanceStore } from '@/store/attendanceStore'
import { Fingerprint } from 'lucide-react'

export function AttendanceButton() {
  const { setStep } = useAttendanceStore()

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setStep('gps')}
        className="relative w-44 h-44 rounded-full gradient-brand shadow-lg animate-pulse-ring flex flex-col items-center justify-center gap-3 text-white"
        aria-label="Mark Attendance"
      >
        {/* Outer rings */}
        <div className="absolute inset-0 rounded-full border-2 border-indigo-300/40 scale-110" />
        <div className="absolute inset-0 rounded-full border border-indigo-200/20 scale-125" />

        <Fingerprint className="w-14 h-14 drop-shadow-lg" />
        <span className="text-sm font-semibold tracking-wide">Mark Attendance</span>
      </motion.button>

      <p className="text-xs text-gray-400 text-center max-w-48">
        Tap to begin. Camera and GPS access required.
      </p>
    </div>
  )
}
