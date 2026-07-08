import { formatTime, getStatusLabel } from '@/lib/utils'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { AttendanceStatus } from '@prisma/client'
import { StatusBadge } from '@/components/ui/DesignSystem'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'

interface RecentAttendanceProps {
  records: {
    id: string
    status: AttendanceStatus
    checkInTime: Date | null
    user: { id: string; name: string; employeeId: string; profileImageUrl: string | null }
    site: { id: string; name: string; code: string } | null
  }[]
}

export function RecentAttendance({ records }: RecentAttendanceProps) {
  return (
    <Card>
      <CardHeader
        title="Today's attendance feed"
        description="Live check-ins from the field"
        action={
          <Link href="/admin/attendance" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      <CardContent className="p-0">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-white p-4 shadow-sm">
              <Clock className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No attendance activity yet</p>
            <p className="max-w-xs text-sm text-slate-500">The latest field check-ins will appear here automatically.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const tone = record.status === 'PRESENT' || record.status === 'LATE' || record.status === 'HALF_DAY'
                ? 'success'
                : record.status === 'ABSENT'
                  ? 'danger'
                  : 'info'

              return (
                <div key={record.id} className="group flex items-center gap-4 rounded-[1.5rem] border border-slate-200/80 bg-white px-5 py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:bg-slate-50/80 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-semibold text-white">
                    {(record.user.name || 'U').charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1">
                      <p className="truncate text-sm font-semibold text-slate-950">{record.user.name || 'Unknown'}</p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{record.user.employeeId}</span>
                        {record.site && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {record.site.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{record.checkInTime ? formatTime(record.checkInTime) : 'Pending'}</span>
                    <StatusBadge label={getStatusLabel(record.status)} tone={tone} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
