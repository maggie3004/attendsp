'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'

interface ErrorStepProps {
  onRetry: () => void
}

export function ErrorStep({ onRetry }: ErrorStepProps) {
  const { errorMessage } = useAttendanceStore()

  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-400" />
        </div>
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-red-600 tracking-tight">Verification Failed</h2>
        <p className="text-sm font-medium text-slate-500 max-w-xs">
          {errorMessage ?? 'Something went wrong. Please try again.'}
        </p>
      </div>

      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand hover:bg-brand-600 text-white font-bold text-sm shadow-sm transition-colors"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  )
}
