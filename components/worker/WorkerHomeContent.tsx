'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, Calendar, CheckCircle2, Clock, PalmtreeIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/DesignSystem'

interface WorkerHomeContentProps {
  firstName: string
  date: string
  todayAttendance: {
    id: string
    status: string
    checkInTime?: Date | null
    site?: { id: string; name: string } | null
  } | null
  stats: {
    totalDays: number
    presentDays: number
    absentDays: number
    pendingLeaves: number
  }
  approvalLeaves: { id: string }[]
  recentRecords: {
    id: string
    status: string
    checkInTime?: Date | null
    checkOutTime?: Date | null
    site?: { name: string } | null
  }[]
}

function dotColor(status: string, hasCheckout?: boolean) {
  if (status === 'ABSENT') return 'bg-red-500'
  if (hasCheckout) return 'bg-amber-500'
  return 'bg-emerald-500'
}

export function WorkerHomeContent({
  todayAttendance,
  stats,
  approvalLeaves,
  recentRecords,
}: WorkerHomeContentProps) {
  return (
    <div className="flex flex-col gap-7 px-5 pt-6 pb-10">
      {/* Today's Status */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card className="shadow-xl shadow-black/5 rounded-[2rem] border-none">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Today&apos;s Status</h2>
              {todayAttendance && (
                <StatusBadge label="Present" tone="success" />
              )}
            </div>
            {todayAttendance ? (
              <div>
                {todayAttendance.checkInTime && (
                  <p className="text-2xl font-bold text-foreground">
                    {format(todayAttendance.checkInTime, 'hh:mm a')}
                  </p>
                )}
                {todayAttendance.site && (
                  <p className="mt-1 text-xs text-foreground-muted">{todayAttendance.site.name}</p>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100">
                  <Clock className="h-6 w-6 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[17px] font-bold text-slate-900">Not checked in yet</p>
                  <p className="mt-1 text-[13px] text-slate-500">Tap Mark Attendance to begin</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-3"
      >
        {[
          { value: stats.totalDays, label: 'Total Days', className: '' },
          { value: stats.presentDays, label: 'Present', className: 'text-emerald-600' },
          { value: stats.absentDays, label: 'Absent', className: 'text-red-600' },
          { value: stats.pendingLeaves, label: 'Leaves', className: '' },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-md shadow-black/5 rounded-2xl">
            <CardContent className="p-3.5 text-center">
              <p className={`text-xl font-bold leading-none ${stat.className || 'text-foreground'}`}>
                {stat.value}
              </p>
              <p className={`mt-1 text-[10px] ${stat.className || 'text-foreground-muted'}`}>
                {stat.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Primary action */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Link href="/worker/attendance" className="block">
          <Button variant="primary" className="h-[60px] w-full text-[17px] font-bold rounded-2xl shadow-lg shadow-brand/25">
            <Camera className="h-5 w-5 mr-2.5" />
            Mark Attendance
          </Button>
        </Link>
      </motion.div>

      {/* Secondary actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="grid grid-cols-2 gap-3"
      >
        <Link href="/worker/leave">
          <Card className="border-none shadow-md shadow-black/5 rounded-2xl transition-all hover:bg-slate-50 active:scale-[0.98]">
            <CardContent className="flex items-center gap-3 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-elevated">
                <Calendar className="h-4 w-4 text-brand" />
              </div>
              <span className="text-[13px] font-semibold text-foreground">Request Leave</span>
            </CardContent>
          </Card>
        </Link>
        <Card className={`border-none shadow-md shadow-black/5 rounded-2xl ${approvalLeaves.length > 0 ? '' : 'opacity-80'}`}>
          <CardContent className="flex items-center justify-between gap-2 p-5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-surface-elevated">
                <PalmtreeIcon className="h-4 w-4 text-brand" />
              </div>
              <span className="text-[13px] font-semibold text-foreground truncate">My Approvals</span>
            </div>
            {approvalLeaves.length > 0 && (
              <span className="flex-shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {approvalLeaves.length} Pending
              </span>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      {recentRecords.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
          <Card className="border-none shadow-md shadow-black/5 rounded-2xl">
            <CardContent className="p-6">
              <h2 className="mb-3 text-sm font-semibold text-foreground">Recent Activity</h2>
              <div className="space-y-0">
                {recentRecords.slice(0, 4).map((record, idx) => (
                  <div
                    key={record.id}
                    className="flex items-start gap-3 py-2.5 border-b border-surface-border last:border-0"
                  >
                    <div className="flex flex-col items-center pt-1.5">
                      <div className={`h-2 w-2 rounded-full ${dotColor(record.status, !!record.checkOutTime)}`} />
                      {idx < Math.min(recentRecords.length, 4) - 1 && (
                        <div className="mt-1 w-px flex-1 bg-surface-border min-h-[20px]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium text-foreground">
                        {record.checkOutTime ? 'Checked out' : record.checkInTime ? 'Checked in' : record.status.toLowerCase()}
                      </p>
                      {record.site && (
                        <p className="text-[11px] text-foreground-muted truncate">{record.site.name}</p>
                      )}
                    </div>
                    {(record.checkInTime || record.checkOutTime) && (
                      <p className="flex-shrink-0 text-[11px] text-foreground-subtle">
                        {format(record.checkOutTime ?? record.checkInTime!, 'hh:mm a')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
