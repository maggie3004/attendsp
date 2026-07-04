'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, MapPin, Clock } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'
import { formatTime } from '@/lib/utils'

export function SuccessStep() {
  const { matchedSite, gpsData, isOffline, reset } = useAttendanceStore()
  const now = new Date()

  return (
    <div className="flex flex-col items-center gap-6 text-center py-4">
      {/* Success icon with rings */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
      >
        <div className="w-28 h-28 rounded-full bg-green-50 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 rounded-full border-2 border-green-400"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-1"
      >
        <h2 className="text-xl font-bold text-green-600">
          {isOffline ? 'Queued Offline' : 'Attendance Marked!'}
        </h2>
        <p className="text-gray-400 text-sm">
          {isOffline
            ? 'Your attendance will sync automatically when you come online.'
            : 'Your attendance has been recorded successfully.'}
        </p>
      </motion.div>

      {/* Details card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full card p-4 space-y-3 text-left"
      >
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-500">Check-in Time</span>
          <span className="ml-auto font-semibold text-gray-800">{formatTime(now)}</span>
        </div>
        {matchedSite && (
          <div className="flex items-center gap-3 text-sm border-t border-gray-200 pt-3">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-500">Site</span>
            <span className="ml-auto font-semibold text-gray-800 truncate max-w-36">{matchedSite.siteName}</span>
          </div>
        )}
        {gpsData && (
          <div className="flex items-center gap-3 text-sm border-t border-gray-200 pt-3">
            <div className="w-4 h-4 rounded-full border border-green-400 flex items-center justify-center flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-500">GPS Accuracy</span>
            <span className="ml-auto font-semibold text-gray-800">±{gpsData.accuracy}m</span>
          </div>
        )}
      </motion.div>

      {/* Done button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        onClick={reset}
        className="w-full py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-indigo-200 transition-all"
      >
        Done
      </motion.button>
    </div>
  )
}
