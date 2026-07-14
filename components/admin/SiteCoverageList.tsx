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
          <div key={site.id} className="flex items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <MapPin className="h-4 w-4 flex-shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold text-foreground">{site.name}</p>
                <p className="text-[11px] font-medium text-foreground-muted mt-0.5">{present} / {total} present</p>
              </div>
            </div>
            <div className="flex w-[130px] flex-shrink-0 items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-border/50">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(pct)}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-8 text-right text-[12px] font-bold text-foreground">{pct}%</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
