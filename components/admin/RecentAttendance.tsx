import { timeAgo } from '@/lib/utils'
import { Clock } from 'lucide-react'
import type { AttendanceStatus } from '@prisma/client'

interface RecentAttendanceProps {
  records: {
    id: string
    status: AttendanceStatus
    checkInTime: Date | null
    checkOutTime?: Date | null
    user: { id: string; name: string; employeeId: string; profileImageUrl: string | null }
    site: { id: string; name: string; code: string } | null
  }[]
  compact?: boolean
}

function getActivityBadge(status: AttendanceStatus, checkOutTime?: Date | null) {
  if (status === 'ABSENT') {
    return { label: 'ABSENT', className: 'bg-amber-100 text-amber-800 border-amber-300' }
  }
  if (checkOutTime) {
    return { label: 'OUT', className: 'bg-red-100 text-red-800 border-red-300' }
  }
  return { label: 'IN', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
}

function getActionText(record: RecentAttendanceProps['records'][0]) {
  if (record.status === 'ABSENT') return 'Marked absent today'
  if (record.checkOutTime) {
    return `Checked out from ${record.site?.name ?? 'site'}`
  }
  if (record.checkInTime) {
    return `Checked in at ${record.site?.name ?? 'site'}`
  }
  return record.site?.name ?? record.user.employeeId
}

export function RecentAttendance({ records }: RecentAttendanceProps) {
  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
        <div className="rounded-full bg-surface p-3">
          <Clock className="h-5 w-5 text-foreground-subtle" />
        </div>
        <p className="text-sm font-medium text-foreground-muted">No attendance activity yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-surface-border">
      {records.slice(0, 5).map((record) => {
        const badge = getActivityBadge(record.status, record.checkOutTime)
        const timestamp = record.checkOutTime ?? record.checkInTime

        return (
          <div
            key={record.id}
            className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
          >
            {record.user.profileImageUrl ? (
              <img src={record.user.profileImageUrl} alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-semibold text-white">
                {(record.user.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">{record.user.name || 'Unknown'}</p>
              <p className="truncate text-[11px] text-foreground-muted">{getActionText(record)}</p>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
              {timestamp && (
                <span className="hidden text-[10px] text-foreground-subtle sm:inline">{timeAgo(timestamp)}</span>
              )}
              <span className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${badge.className}`}>
                {badge.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
