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
import { CalendarCheck, MapPin, Clock, History, BadgeCheck, Camera } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/DesignSystem'

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
  useEffect(() => { setMounted(true) }, [])

  const now = new Date()
  const displayStatus = todayStatus || 'PENDING'
  const statusClass = getStatusColor(displayStatus as Parameters<typeof getStatusColor>[0])
  const statusLabel = getStatusLabel(displayStatus as Parameters<typeof getStatusLabel>[0])

  return (
    <div className="min-h-full pb-4">
      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="flex flex-col gap-7 px-5 pt-6 pb-10">
            
            {/* Attendance Details Card */}
            <Card className="shadow-xl shadow-black/5 rounded-[2rem] border-none">
              <CardContent className="p-6">
                <h2 className="mb-4 text-sm font-semibold text-foreground">Attendance Details</h2>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-foreground-muted">Today&apos;s status</p>
                    <StatusBadge 
                      label={statusLabel} 
                      tone={displayStatus === 'PRESENT' ? 'success' : displayStatus === 'ABSENT' ? 'danger' : displayStatus === 'LATE' ? 'warning' : 'neutral'} 
                    />
                  </div>
                  <div className="h-px bg-surface-border" />
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[13px] font-medium text-foreground-muted shrink-0">Assigned site</p>
                    <p className="text-[13px] font-bold text-foreground text-right truncate">{assignedSite || 'Unassigned'}</p>
                  </div>
                  <div className="h-px bg-surface-border" />
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-foreground-muted">Shift window</p>
                    <p className="text-[13px] font-bold text-foreground">{shiftTiming || '09:00 – 18:00'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Check-in Action Card */}
            <Card className="border-brand/20 bg-brand/5 shadow-md shadow-brand/5 rounded-[2rem]">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/20">
                  <Camera className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-[15px] font-bold text-foreground">Secure Check-in</h3>
                <p className="mb-5 text-[13px] text-foreground-muted">
                  Verify your identity and location to mark attendance for {formatDate(now, 'MMMM d')}.
                </p>
                <div className="w-full">
                  <AttendanceButton />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {recentRecords.length > 0 && (
              <div className="pt-2">
                <div className="mb-3 flex items-center gap-2 px-1">
                  <History className="h-4 w-4 text-foreground-subtle" />
                  <h3 className="text-sm font-semibold text-foreground">Recent activity</h3>
                </div>
                <div className="space-y-3">
                  {recentRecords.map((record, idx) => (
                    <motion.div key={record.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Card className="border-none shadow-md shadow-black/5 rounded-2xl">
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="min-w-0 flex-1 pr-3">
                            <p className="text-[13px] font-bold text-foreground truncate">{formatDate(record.date, 'MMM dd, yyyy')}</p>
                            <p className="mt-0.5 text-[11px] font-medium text-foreground-subtle">
                              {record.checkInTime ? formatTime(record.checkInTime) : 'Not checked in'}
                              {record.checkOutTime ? ` – ${formatTime(record.checkOutTime)}` : ''}
                            </p>
                          </div>
                          <div className="shrink-0">
                            <StatusBadge 
                              label={getStatusLabel(record.status as Parameters<typeof getStatusLabel>[0])}
                              tone={record.status === 'PRESENT' ? 'success' : record.status === 'ABSENT' ? 'danger' : record.status === 'LATE' ? 'warning' : 'neutral'}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'gps' && (
          <motion.div key="gps" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <GpsStep />
          </motion.div>
        )}

        {step === 'camera' && (
          <motion.div key="camera" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <CameraStep />
          </motion.div>
        )}

        {(step === 'verifying' || step === 'saving') && (
          <motion.div key="verifying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <VerifyingStep />
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <SuccessStep />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <ErrorStep onRetry={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
