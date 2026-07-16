import { MapPin } from 'lucide-react'
import type { AttendanceStatus } from '@prisma/client'

interface SiteData {
  id: string
  name: string
  code: string
  _count: { employeeAssignments: number }
  attendanceRecords: { status: AttendanceStatus }[]
}

interface SiteCoverageListProps {
  sites: SiteData[]
}

function getBarColor(pct: number) {
  if (pct === 0) return 'bg-slate-300'
  if (pct >= 90) return 'bg-emerald-500'
  if (pct >= 75) return 'bg-amber-500'
  return 'bg-red-500'
}

export function SiteCoverageList({ sites }: SiteCoverageListProps) {
  if (sites.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-border py-8 text-center text-sm text-foreground-subtle">
        No active sites
      </div>
    )
  }

  return (
    <div className="space-y-3 mt-1">
      {sites.map((site) => {
        const present = site.attendanceRecords.filter(
          (r) => ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
        ).length
        const total = site._count.employeeAssignments
        const pct = total > 0 ? Math.round((present / total) * 100) : 0

        return (
          <div key={site.id} className="flex items-center justify-between py-1">
            <div className="flex min-w-0 flex-1 items-start gap-4">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-slate-900">{site.name}</p>
                <p className="text-[12px] font-medium text-slate-500 mt-0.5">{present} / {total} present</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center pl-4">
              <span className="text-[14px] font-bold text-slate-900">{pct}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
