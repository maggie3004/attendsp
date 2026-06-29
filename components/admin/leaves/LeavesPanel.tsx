'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, Calendar, Clock, AlertTriangle } from 'lucide-react'
import { formatDate, formatDateTime } from '@/lib/utils'
import type { LeaveType, LeaveStatus } from '@prisma/client'

interface LeaveRequest {
  id: string
  type: LeaveType
  startDate: string
  endDate: string
  totalDays: number
  reason: string
  status: LeaveStatus
  isEmergency: boolean
  createdAt: string
  user: { id: string; name: string; employeeId: string }
}

const LEAVE_COLORS: Record<LeaveType, string> = {
  CASUAL: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  SICK: 'text-red-400 bg-red-500/10 border-red-500/20',
  ANNUAL: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  EMERGENCY: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  UNPAID: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
  COMPENSATORY: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
}

export function LeavesPanel({ initialPending }: { initialPending: LeaveRequest[] }) {
  const [pending, setPending] = useState(initialPending)
  const [processingId, setProcessingId] = useState<string | null>(null)

  async function respond(id: string, status: 'APPROVED' | 'REJECTED', note?: string) {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/leaves/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, approverNote: note }),
      })
      if (res.ok) {
        setPending((prev) => prev.filter((l) => l.id !== id))
      }
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {pending.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card py-16 flex flex-col items-center gap-3 text-foreground/40"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400/50" />
            <p>All caught up! No pending leave requests.</p>
          </motion.div>
        ) : (
          pending.map((leave) => (
            <motion.div
              key={leave.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="card p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold">
                    {leave.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{leave.user.name}</div>
                    <div className="text-xs text-foreground/40">{leave.user.employeeId}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {leave.isEmergency && (
                    <span className="flex items-center gap-1 text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="w-3 h-3" />
                      Emergency
                    </span>
                  )}
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${LEAVE_COLORS[leave.type]}`}>
                    {leave.type}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2 text-foreground/60">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(leave.startDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/60">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(leave.endDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-foreground/60">
                  <Clock className="w-4 h-4" />
                  <span>{leave.totalDays} {leave.totalDays === 1 ? 'day' : 'days'}</span>
                </div>
              </div>

              <p className="text-sm text-foreground/60 bg-surface-elevated rounded-xl p-3 mb-4 border border-surface-border">
                {leave.reason}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => respond(leave.id, 'APPROVED')}
                  disabled={processingId === leave.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => respond(leave.id, 'REJECTED', 'Request denied')}
                  disabled={processingId === leave.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}
