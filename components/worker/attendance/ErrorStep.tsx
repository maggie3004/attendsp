'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'
import { Button } from '@/components/ui/Button'

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
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-12 w-12 text-red-400" />
        </div>
      </motion.div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold text-red-600">Verification Failed</h2>
        <p className="max-w-xs text-sm text-foreground-muted">
          {errorMessage ?? 'Something went wrong. Please try again.'}
        </p>
      </div>

      <Button variant="primary" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  )
}
