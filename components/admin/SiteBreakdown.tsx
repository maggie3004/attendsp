import { MapPin, Users } from 'lucide-react'
import type { AttendanceStatus } from '@prisma/client'

interface SiteData {
  id: string
  name: string
  code: string
  _count: { employeeAssignments: number }
  attendanceRecords: { status: AttendanceStatus }[]
}

interface SiteBreakdownProps {
  sites: SiteData[]
}

export function SiteBreakdown({ sites }: SiteBreakdownProps) {
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Sites Today</h2>
        <a href="/admin/sites" className="text-xs text-brand hover:underline">Manage</a>
      </div>
      <div className="p-4 space-y-3">
        {sites.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-sm">No active sites</div>
        ) : (
          sites.map((site) => {
            const present = site.attendanceRecords.filter(
              (r) => ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
            ).length
            const total = site._count.employeeAssignments
            const pct = total > 0 ? Math.round((present / total) * 100) : 0

            return (
              <div key={site.id} className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 hover:border-indigo-200 transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1.5 rounded-lg bg-indigo-50">
                      <MapPin className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">{site.name}</div>
                      <div className="text-xs text-gray-400">{site.code}</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-green-600 flex-shrink-0">{pct}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Users className="w-3 h-3" />
                  <span>{present}/{total} present</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

