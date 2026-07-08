import { formatDate, formatTime, getStatusColor, getStatusLabel, cn } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'
import type { AttendanceStatus } from '@prisma/client'

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
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-white p-12 text-center text-slate-400 shadow-sm">
        <Clock className="w-10 h-10" />
        <p className="mt-4 text-sm font-medium">No attendance records this month</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div key={record.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
          {/* Date */}
          <div className="text-center flex-shrink-0 w-12">
            <div className="text-lg font-bold leading-none text-slate-900">{formatDate(record.date, 'd')}</div>
            <div className="text-xs text-slate-500 mt-0.5">{formatDate(record.date, 'EEE')}</div>
          </div>

          <div className="w-px h-10 bg-slate-200 flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            {record.site && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{record.site.name}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-slate-500">
              {record.checkInTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  In: {formatTime(record.checkInTime)}
                </span>
              )}
              {record.checkOutTime && (
                <span>Out: {formatTime(record.checkOutTime)}</span>
              )}
            </div>
          </div>

          {/* Status */}
          <div className={cn('px-2.5 py-1 rounded-full text-xs font-semibold border flex-shrink-0', getStatusColor(record.status))}>
            {getStatusLabel(record.status)}
          </div>
        </div>
      ))}
    </div>
  )
}
