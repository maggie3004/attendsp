'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { SectionCard } from '@/components/ui/DesignSystem'
import { cn } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Users, Clock, TrendingDown, IndianRupee, AlertTriangle, Trophy } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
interface SiteAtRisk {
  siteId: string
  siteName: string
  assignedWorkers: number
  attendanceRate: number
  risk: 'Critical' | 'Warning'
}

interface TopSite {
  siteName: string
  attendanceRate: number
  assignedWorkers: number
}

interface WeeklyTrendEntry {
  day: string
  count: number
}

interface HeatmapEntry {
  day: string
  absences: number
}

interface InsightsDashboardProps {
  totalWorkersOnPayroll: number
  avgAttendanceRate: number
  lostHoursEstimate: number
  lostRevenueEstimate: number
  sitesAtRisk: SiteAtRisk[]
  topPerformingSites: TopSite[]
  weeklyTrend: WeeklyTrendEntry[]
  absenceHeatmap: HeatmapEntry[]
}

// ── Helper: number formatter ────────────────────────────────────────
function formatINR(value: number): string {
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value}`
}

// ── Hero KPI Card ───────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sublabel,
  icon: Icon,
  tone,
  accent,
}: {
  label: string
  value: string | number
  sublabel?: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
  accent: string
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-card-hover">
      <div className="flex min-h-[128px] flex-col p-5">
        <div className={cn('mb-3 flex h-9 w-9 items-center justify-center rounded-lg', tone)}>
          <Icon className={cn('h-5 w-5', accent)} />
        </div>
        <p className="text-xs font-medium text-foreground-muted">{label}</p>
        <p className="mt-0.5 text-[28px] font-bold leading-none tracking-tight text-foreground">
          {value}
        </p>
        {sublabel && <p className="mt-1.5 text-xs text-foreground-muted">{sublabel}</p>}
      </div>
    </Card>
  )
}

// ── Custom Tooltip for BarChart ────────────────────────────────────
function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-surface-border bg-white px-4 py-3 text-sm shadow-card">
      <div className="mb-1 text-xs font-semibold text-foreground-muted">{label}</div>
      <div className="text-base font-bold text-foreground">{payload?.[0]?.value ?? 0} absences</div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────
export function InsightsDashboard({
  totalWorkersOnPayroll,
  avgAttendanceRate,
  lostHoursEstimate,
  lostRevenueEstimate,
  sitesAtRisk,
  topPerformingSites,
  weeklyTrend,
  absenceHeatmap,
}: InsightsDashboardProps) {
  const maxAbsences = Math.max(...absenceHeatmap.map((h) => h.absences), 1)

  return (
    <div className="space-y-6">
      {/* ── Hero KPI Row ─────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total on Payroll"
          value={totalWorkersOnPayroll}
          sublabel="Active workers"
          icon={Users}
          tone="bg-blue-50"
          accent="text-blue-600"
        />
        <KpiCard
          label="30-day Attendance Rate"
          value={`${avgAttendanceRate}%`}
          sublabel="Present / Expected"
          icon={TrendingDown}
          tone={avgAttendanceRate >= 80 ? 'bg-emerald-50' : avgAttendanceRate >= 60 ? 'bg-amber-50' : 'bg-red-50'}
          accent={avgAttendanceRate >= 80 ? 'text-emerald-600' : avgAttendanceRate >= 60 ? 'text-amber-600' : 'text-red-600'}
        />
        <KpiCard
          label="Lost Hours (last 30d)"
          value={`${lostHoursEstimate.toLocaleString()} hrs`}
          sublabel="Absent days × 8 hrs"
          icon={Clock}
          tone="bg-orange-50"
          accent="text-orange-600"
        />
        <KpiCard
          label="Estimated Lost Revenue"
          value={formatINR(lostRevenueEstimate)}
          sublabel="@ ₹350/hr assumed rate"
          icon={IndianRupee}
          tone="bg-red-50"
          accent="text-red-600"
        />
      </div>

      {/* ── Middle row: Sites at Risk + Top Performing ────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sites at Risk */}
        <SectionCard
          title="Sites at Risk"
          description="Sites where <60% of assigned workers attended in last 7 days"
        >
          {sitesAtRisk.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle className="mb-2 h-8 w-8 text-emerald-400" />
              <p className="text-sm font-medium text-foreground-muted">All sites performing well</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {sitesAtRisk.map((site) => (
                <div key={site.siteId} className="flex flex-col rounded-[1.5rem] border border-surface-border bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <span className="font-bold text-foreground text-base">{site.siteName}</span>
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase',
                        site.risk === 'Critical'
                          ? 'border-red-200 bg-red-50 text-red-700'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      )}
                    >
                      {site.risk}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-foreground-muted mt-2">
                    <span className="font-medium text-slate-500">Workers Assigned</span>
                    <span className="font-bold text-slate-900">{site.assignedWorkers}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-foreground-muted mt-2">
                    <span className="font-medium text-slate-500">Attendance (7d)</span>
                    <span className="font-bold text-slate-900">{site.attendanceRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Top Performing Sites */}
        <SectionCard
          title="Top Performing Sites"
          description="Highest attendance rate in last 30 days"
        >
          {topPerformingSites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Trophy className="mb-2 h-8 w-8 text-foreground-subtle" />
              <p className="text-sm font-medium text-foreground-muted">No site data available</p>
            </div>
          ) : (
            <div className="space-y-5">
              {topPerformingSites.map((site, idx) => (
                <div key={site.siteName} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={cn(
                          'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                          idx === 0
                            ? 'bg-amber-100 text-amber-700'
                            : idx === 1
                              ? 'bg-slate-100 text-slate-600'
                              : 'bg-orange-50 text-orange-600'
                        )}
                      >
                        {idx + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">
                        {site.siteName}
                      </span>
                    </div>
                    <span className="flex-shrink-0 text-sm font-bold text-foreground">
                      {site.attendanceRate}%
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        idx === 0
                          ? 'bg-emerald-500'
                          : idx === 1
                            ? 'bg-blue-500'
                            : 'bg-indigo-400'
                      )}
                      style={{ width: `${site.attendanceRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-foreground-muted">
                    {site.assignedWorkers} assigned workers
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Bottom row: Weekly Pattern + Heatmap ─────────────────── */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Pattern Bar Chart */}
        <SectionCard
          title="Weekly Absence Pattern"
          description="Absence count by day of week (last 30 days)"
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={absenceHeatmap}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="absences" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        {/* Absence Heatmap – 7 day boxes */}
        <SectionCard
          title="Absence Heatmap"
          description="Colour intensity represents frequency of absences — Mon to Sun"
        >
          <div className="grid grid-cols-7 gap-2">
            {absenceHeatmap.map((entry) => {
              const intensity = maxAbsences > 0 ? entry.absences / maxAbsences : 0
              // Map to red shades: 0 → 50, 0.25 → 100, 0.5 → 200, 0.75 → 400, 1 → 600
              const shade =
                intensity === 0
                  ? 'bg-red-50 text-red-300'
                  : intensity < 0.25
                    ? 'bg-red-100 text-red-500'
                    : intensity < 0.5
                      ? 'bg-red-200 text-red-700'
                      : intensity < 0.75
                        ? 'bg-red-400 text-white'
                        : 'bg-red-600 text-white'

              return (
                <div
                  key={entry.day}
                  className={cn(
                    'flex aspect-square flex-col items-center justify-center rounded-xl text-center transition-opacity',
                    shade
                  )}
                  title={`${entry.day}: ${entry.absences} absences`}
                >
                  <span className="text-[10px] font-bold uppercase leading-none tracking-wide">
                    {entry.day}
                  </span>
                  <span className="mt-1 text-lg font-extrabold leading-none">
                    {entry.absences}
                  </span>
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xs text-foreground-muted">Fewer</span>
            {['bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-400', 'bg-red-600'].map((c) => (
              <div key={c} className={cn('h-3 w-5 rounded', c)} />
            ))}
            <span className="text-xs text-foreground-muted">More</span>
          </div>
        </SectionCard>
      </div>

      {/* ── Weekly Attendance Trend (presence count by day) ───────── */}
      <SectionCard
        title="Weekly Attendance Trend"
        description="Total present check-ins grouped by day of week over the last 30 days"
      >
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={weeklyTrend}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="rounded-xl border border-surface-border bg-white px-4 py-3 text-sm shadow-card">
                    <div className="mb-1 text-xs font-semibold text-foreground-muted">{label}</div>
                    <div className="text-base font-bold text-foreground">
                      {payload?.[0]?.value ?? 0} present
                    </div>
                  </div>
                )
              }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  )
}
