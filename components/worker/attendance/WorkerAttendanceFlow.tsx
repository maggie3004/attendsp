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
import { CalendarCheck, MapPin, Clock, History, BadgeCheck } from 'lucide-react'

interface WorkerAttendanceFlowProps {
  userName: string
  todayStatus: string | null
  assignedSite: string | null
  shiftTiming: string | null
  recentRecords: {
    id: string
    date: Date
    status: string
    checkInTime: Date | null
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
  const displayStatus = todayStatus || 'PENDING'
  const statusClass = getStatusColor(displayStatus as any)
  const statusLabel = getStatusLabel(displayStatus as any)

  return (
    <div className="min-h-full bg-slate-50 px-4 pb-4 pt-6">
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          <BadgeCheck className="h-4 w-4" /> Workforce check-in
        </div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Hello, {userName}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <CalendarCheck className="h-4 w-4" />
            {mounted ? formatDate(now, 'EEE, dd MMM yyyy') : <span className="opacity-0">Loading</span>}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {mounted ? formatTime(now) : <span className="opacity-0">--:--</span>}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-1 flex-col gap-6">
        <AnimatePresence mode="wait">
          {step === 'idle' && (
            <motion.div key="idle" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex w-full flex-col gap-6">
              {/* Status Cards Grid */}
              <div className="grid gap-3 sm:grid-cols-2">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.05 }}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Today&apos;s status</p>
                  <div className={`mt-3 inline-flex w-fit items-center rounded-full px-3 py-1.5 text-sm font-semibold ${statusClass}`}>{statusLabel}</div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.1 }}
                  className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Assigned site</p>
                  <p className="mt-3 text-sm font-bold text-slate-900">{assignedSite || 'Unassigned'}</p>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.15 }}
                  className="col-span-full rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Shift window</p>
                  <p className="mt-3 text-lg font-bold text-slate-900">{shiftTiming || 'Standard (09:00 - 18:00)'}</p>
                </motion.div>
              </div>

              {/* Primary Action */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="rounded-[2rem] border border-blue-200/40 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 p-6 shadow-[0_16px_40px_rgba(37,99,235,0.08)]"
              > 
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <MapPin className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900">Start secure check-in</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <AttendanceButton />
                </div>
              </motion.div>

              {/* Recent Attendance */}
              {recentRecords.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.25 }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                      <History className="h-4 w-4 text-slate-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">Recent activity</h3>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {recentRecords.map((record, idx) => (
                      <motion.div 
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + idx * 0.05 }}
                        className="rounded-[1.25rem] border border-slate-200/60 bg-white p-4 shadow-[0_8px_20px_rgba(15,23,42,0.04)] flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{formatDate(record.date, 'MMM dd, yyyy')}</div>
                          <div className="mt-1 text-xs text-slate-500 font-medium">{record.checkInTime ? formatTime(record.checkInTime) : 'Not checked in'} {record.checkOutTime ? `- ${formatTime(record.checkOutTime)}` : ''}</div>
                        </div>
                        <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusColor(record.status as any)}`}>{getStatusLabel(record.status as any)}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 'gps' && (
            <motion.div key="gps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex w-full flex-1 flex-col justify-center">
              <GpsStep />
            </motion.div>
          )}

          {step === 'camera' && (
            <motion.div key="camera" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex w-full flex-1 flex-col justify-center">
              <CameraStep />
            </motion.div>
          )}

          {(step === 'verifying' || step === 'saving') && (
            <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex w-full flex-1 flex-col justify-center">
              <VerifyingStep />
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex w-full flex-1 flex-col justify-center">
              <SuccessStep />
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex w-full flex-1 flex-col justify-center">
              <ErrorStep onRetry={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
