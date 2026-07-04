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
      <div className="card py-12 flex flex-col items-center gap-3 text-gray-400">
        <Clock className="w-10 h-10" />
        <p className="text-sm">No attendance records this month</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {records.map((record) => (
        <div key={record.id} className="card p-4 flex items-center gap-4">
          {/* Date */}
          <div className="text-center flex-shrink-0 w-12">
            <div className="text-lg font-bold leading-none text-gray-800">{formatDate(record.date, 'd')}</div>
            <div className="text-xs text-gray-400 mt-0.5">{formatDate(record.date, 'EEE')}</div>
          </div>

          <div className="w-px h-10 bg-gray-100 flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 min-w-0">
            {record.site && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{record.site.name}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-500">
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
          <div className={cn('px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0', getStatusColor(record.status))}>
            {getStatusLabel(record.status)}
          </div>
        </div>
      ))}
    </div>
  )
}
