'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, MapPin, Clock } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'
import { formatTime } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export function SuccessStep() {
  const { matchedSite, gpsData, isOffline, reset } = useAttendanceStore()
  const now = new Date()

  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
      >
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
        />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-1">
        <h2 className="text-xl font-bold text-emerald-700">
          {isOffline ? 'Queued Offline' : 'Attendance Marked!'}
        </h2>
        <p className="text-sm text-foreground-muted">
          {isOffline
            ? 'Your attendance will sync automatically when you come online.'
            : 'Your attendance has been recorded successfully.'}
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full">
        <Card>
          <CardContent className="space-y-3 p-4 text-left">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-foreground-subtle" />
              <span className="text-foreground-muted">Check-in Time</span>
              <span className="ml-auto font-semibold text-foreground">{formatTime(now)}</span>
            </div>
            {matchedSite && (
              <div className="flex items-center gap-3 border-t border-surface-border pt-3 text-sm">
                <MapPin className="h-4 w-4 text-foreground-subtle" />
                <span className="text-foreground-muted">Site</span>
                <span className="ml-auto max-w-36 truncate font-semibold text-foreground">{matchedSite.siteName}</span>
              </div>
            )}
            {gpsData && (
              <div className="flex items-center gap-3 border-t border-surface-border pt-3 text-sm">
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-emerald-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <span className="text-foreground-muted">GPS Accuracy</span>
                <span className="ml-auto font-semibold text-foreground">±{gpsData.accuracy}m</span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="w-full">
        <Button variant="primary" size="lg" fullWidth onClick={reset}>
          Done
        </Button>
      </motion.div>
    </div>
  )
}
