import { MapPin, Users, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { AttendanceStatus } from '@prisma/client'
import { Card, CardContent } from '@/components/ui/Card'

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
    <div className="space-y-4">
      {sites.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-400">No active sites</div>
      ) : (
        <div className="grid gap-4">
          {sites.map((site) => {
            const present = site.attendanceRecords.filter(
              (r) => ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)
            ).length
            const total = site._count.employeeAssignments
            const pct = total > 0 ? Math.round((present / total) * 100) : 0
            const shiftLabel = 'Day shift'
            const healthLabel = pct >= 90 ? 'Excellent' : pct >= 75 ? 'Good' : pct >= 50 ? 'At risk' : 'Critical'
            const healthTone = pct >= 90 ? 'bg-emerald-50 text-emerald-700' : pct >= 75 ? 'bg-blue-50 text-blue-700' : pct >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'

            return (
              <Card key={site.id} className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.1)]">
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{site.code}</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-950">{site.name}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${healthTone}`}>
                      {healthLabel}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Workers assigned</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{total}</p>
                    </div>
                    <div className="rounded-[1.25rem] bg-slate-50 p-4 text-sm text-slate-600 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Present</p>
                      <p className="mt-2 text-base font-semibold text-slate-950">{present}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <span>Attendance rate</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                    <div className="rounded-[1.25rem] bg-slate-50 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Shift</p>
                      <p className="mt-2 font-semibold text-slate-950">{shiftLabel}</p>
                    </div>
                    <div className="rounded-[1.25rem] bg-slate-50 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Coverage</p>
                      <p className="mt-2 font-semibold text-slate-950">{pct}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

