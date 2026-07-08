'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Camera, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { format } from 'date-fns'

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
  approvalLeaves: any[]
  recentRecords: any[]
}

export function WorkerHomeContent({
  firstName,
  date,
  todayAttendance,
  stats,
  approvalLeaves,
  recentRecords
}: WorkerHomeContentProps) {
  return (
    <div className="min-h-dvh bg-slate-50 pb-6">
      <div className="px-4 space-y-4 pt-6">
        {/* Today's Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
        >
          <h2 className="text-sm font-bold text-slate-900 mb-3">Today's Status</h2>
          {todayAttendance ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-600">Present</p>
                {todayAttendance.checkInTime && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    Checked in at {format(todayAttendance.checkInTime, 'hh:mm a')}
                  </p>
                )}
                {todayAttendance.site && (
                  <p className="text-xs text-slate-500">{todayAttendance.site.name}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Clock className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600">Not checked in yet</p>
                <p className="text-xs text-slate-500 mt-0.5">Tap Mark Attendance to begin</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3"
        >
          {/* Total Days */}
          <div className="rounded-[1.2rem] border border-slate-200 bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-950">{stats.totalDays}</p>
            <p className="text-xs text-slate-500 mt-1">Total Days</p>
          </div>

          {/* Present */}
          <div className="rounded-[1.2rem] border border-emerald-200 bg-emerald-50 p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{stats.presentDays}</p>
            <p className="text-xs text-emerald-600 mt-1">Present</p>
          </div>

          {/* Absent */}
          <div className="rounded-[1.2rem] border border-red-200 bg-red-50 p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
            <p className="text-xs text-red-600 mt-1">Absent</p>
          </div>

          {/* Leaves */}
          <div className="rounded-[1.2rem] border border-slate-200 bg-white p-3 text-center shadow-sm">
            <p className="text-2xl font-bold text-slate-950">{stats.pendingLeaves}</p>
            <p className="text-xs text-slate-500 mt-1">Leaves</p>
          </div>
        </motion.div>

        {/* Mark Attendance Button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Link
            href="/worker/attendance"
            className="flex items-center justify-center gap-2 w-full rounded-[1.5rem] bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-lg hover:shadow-blue-600/30"
          >
            <Camera className="w-5 h-5" />
            Mark Attendance
          </Link>
        </motion.div>

        {/* Request Leave */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/worker/leave"
            className="flex items-center justify-center gap-2 w-full rounded-[1.2rem] border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
          >
            <Calendar className="w-4 h-4" />
            Request Leave
          </Link>
        </motion.div>

        {/* My Approvals */}
        {approvalLeaves.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900">My Approvals</h2>
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                {approvalLeaves.length}
              </span>
            </div>
            <p className="text-xs text-slate-500">View your leave status</p>
          </motion.div>
        )}

        {/* Recent Activity */}
        {recentRecords.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900">Recent Activity</h2>
              <Link href="/worker/history" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="space-y-3">
              {recentRecords.slice(0, 3).map((record, idx) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 mt-0.5">
                    {record.status === 'PRESENT' || record.status === 'LATE' ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    ) : record.status === 'ABSENT' ? (
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-900 capitalize">
                        {record.status === 'HALF_DAY' ? 'Half Day' : record.status.toLowerCase()}
                      </p>
                      {record.checkInTime && (
                        <p className="text-xs text-slate-500">{format(record.checkInTime, 'hh:mm a')}</p>
                      )}
                    </div>
                    {record.site && (
                      <p className="text-xs text-slate-500 mt-0.5">{record.site.name}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

