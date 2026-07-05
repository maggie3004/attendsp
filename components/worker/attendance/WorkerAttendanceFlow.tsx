'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAttendanceStore } from '@/store/attendanceStore'
import { GpsStep } from './GpsStep'
import { CameraStep } from './CameraStep'
import { VerifyingStep } from './VerifyingStep'
import { SuccessStep } from './SuccessStep'
import { ErrorStep } from './ErrorStep'
import { AttendanceButton } from './AttendanceButton'
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { CalendarCheck, MapPin, Clock, History } from 'lucide-react'

interface WorkerAttendanceFlowProps {
  userName: string
  todayStatus: string | null
  assignedSite: string | null
  shiftTiming: string | null
  recentRecords: {
    id: string
    date: Date
    status: string
    checkInTime: Date
    checkOutTime: Date | null
  }[]
}

export function WorkerAttendanceFlow({
  userName,
  todayStatus,
  assignedSite,
  shiftTiming,
  recentRecords,
}: WorkerAttendanceFlowProps) {
  const { step, reset, setIsOffline } = useAttendanceStore()

  useEffect(() => {
    const update = () => setIsOffline(!navigator.onLine)
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    update()
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [setIsOffline])

  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const now = new Date()
  
  // Resolve current status formatting
  const displayStatus = todayStatus || 'PENDING'
  const statusClass = getStatusColor(displayStatus as any)
  const statusLabel = getStatusLabel(displayStatus as any)

  return (
    <div className="flex flex-col min-h-full px-4 pt-6 pb-4 bg-[#F8FAFC]">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Hello, {userName} 👋
        </h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="w-4 h-4" />
            {mounted ? formatDate(now, 'EEE, dd MMM yyyy') : <span className="opacity-0">Loading</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {mounted ? formatTime(now) : <span className="opacity-0">--:--</span>}
          </div>
        </div>
      </motion.div>

      {/* Main flow */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col gap-6"
            >
              {/* Context Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="card p-4 flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Today's Status</span>
                  <span className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-md text-sm font-semibold mt-1 ${statusClass}`}>
                    {statusLabel}
                  </span>
                </div>
                <div className="card p-4 flex flex-col gap-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assigned Site</span>
                  <span className="text-sm font-medium text-slate-900 mt-1 truncate">
                    {assignedSite || 'Unassigned'}
                  </span>
                </div>
                <div className="card p-4 flex flex-col gap-1 col-span-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Today's Shift</span>
                  <span className="text-sm font-medium text-slate-900 mt-1">
                    {shiftTiming || 'Standard (09:00 - 18:00)'}
                  </span>
                </div>
              </div>

              {/* Main Action */}
              <div className="flex justify-center py-4">
                <AttendanceButton />
              </div>

              {/* Recent Activity */}
              {recentRecords.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <History className="w-4 h-4 text-slate-400" />
                    <h3 className="text-sm font-bold text-slate-700">Recent Attendance</h3>
                  </div>
                  <div className="flex flex-col gap-2">
                    {recentRecords.map((record) => (
                      <div key={record.id} className="card p-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{formatDate(record.date, 'MMM dd, yyyy')}</div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {formatTime(record.checkInTime)} {record.checkOutTime ? `- ${formatTime(record.checkOutTime)}` : ''}
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold ${getStatusColor(record.status as any)}`}>
                          {getStatusLabel(record.status as any)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Other steps are strictly for attendance capture */}
          {step === 'gps' && (
            <motion.div key="gps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full flex-1 flex flex-col justify-center">
              <GpsStep />
            </motion.div>
          )}

          {step === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full flex-1 flex flex-col justify-center">
              <CameraStep />
            </motion.div>
          )}

          {(step === 'verifying' || step === 'saving') && (
            <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full flex-1 flex flex-col justify-center">
              <VerifyingStep />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full flex-1 flex flex-col justify-center">
              <SuccessStep />
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full flex-1 flex flex-col justify-center">
              <ErrorStep onRetry={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
