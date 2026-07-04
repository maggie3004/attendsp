import { formatTime, getStatusColor, getStatusLabel } from '@/lib/utils'
import { MapPin, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@prisma/client'

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
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Recent Attendance</h2>
        <a href="/admin/attendance" className="text-xs text-brand hover:underline">View all</a>
      </div>

      {records.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">
          No attendance records for today yet
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {records.map((record) => (
            <div key={record.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {record.user.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{record.user.name}</div>
                <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                  <span>{record.user.employeeId}</span>
                  {record.site && (
                    <>
                      <span>·</span>
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{record.site.name}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Time */}
              {record.checkInTime && (
                <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {formatTime(record.checkInTime)}
                </div>
              )}

              {/* Status badge */}
              <div className={cn('px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0', getStatusColor(record.status))}>
                {getStatusLabel(record.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
