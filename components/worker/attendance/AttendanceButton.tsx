'use client'

import { motion } from 'framer-motion'
import { useAttendanceStore } from '@/store/attendanceStore'
import { Fingerprint } from 'lucide-react'

export function AttendanceButton() {
  const { setStep } = useAttendanceStore()

  return (
    <div className="flex flex-col items-center gap-5">
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={() => setStep('gps')}
        className="w-64 h-24 rounded-[2rem] bg-brand shadow-md flex items-center justify-center gap-4 text-white hover:bg-brand-600 transition-colors"
        aria-label="Mark Attendance"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
          <Fingerprint className="w-7 h-7 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">Mark<br/>Attendance</span>
      </motion.button>

      <p className="text-xs text-gray-400 text-center max-w-48">
        Tap to begin. Camera and GPS access required.
      </p>
    </div>
  )
}
