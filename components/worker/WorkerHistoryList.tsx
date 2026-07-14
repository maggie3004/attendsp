import { formatDate, formatTime, getStatusColor, getStatusLabel, cn } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'
import type { AttendanceStatus } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'

interface Record {
  id: string
  date: Date
  checkInTime: Date | null
  checkOutTime: Date | null
  status: AttendanceStatus
  site: { name: string; code: string } | null
}

export function WorkerHistoryList({ records }: { records: Record[] }) {
  if (records.length === 0) {
    return (
      <Card className="border-dashed shadow-none rounded-[2rem]">
        <CardContent className="flex flex-col items-center py-12 text-center">
          <Clock className="h-10 w-10 text-foreground-subtle" />
          <p className="mt-4 text-[15px] font-medium text-foreground-muted">No attendance records this month</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <Card key={record.id} className="border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-lg font-bold leading-none text-foreground">{formatDate(record.date, 'd')}</div>
              <div className="text-xs text-foreground-muted mt-0.5">{formatDate(record.date, 'EEE')}</div>
            </div>

            <div className="w-px h-10 bg-surface-border flex-shrink-0" />

            <div className="flex-1 min-w-0">
              {record.site && (
                <div className="flex items-center gap-1.5 text-xs text-foreground-muted mb-1">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{record.site.name}</span>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted">
                {record.checkInTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    In: {formatTime(record.checkInTime)}
                  </span>
                )}
                {record.checkOutTime && <span>Out: {formatTime(record.checkOutTime)}</span>}
              </div>
            </div>

            <div className={cn('flex-shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold', getStatusColor(record.status))}>
              {getStatusLabel(record.status)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
