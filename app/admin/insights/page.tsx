import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { InsightsDashboard } from '@/components/admin/insights/InsightsDashboard'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader } from '@/components/ui/DesignSystem'
import { subDays, startOfDay, getDay } from 'date-fns'

export const metadata: Metadata = { title: 'Executive Insights' }

// Map JS day-of-week (0=Sun) to our Mon-Sun display order
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function jsDoWToLabel(jsDay: number): string {
  // 0=Sun → index 6, 1=Mon → 0, …, 6=Sat → 5
  const idx = jsDay === 0 ? 6 : jsDay - 1
  return DAY_LABELS[idx] ?? 'Mon'
}

export default async function InsightsPage() {
  const now = new Date()
  const thirtyDaysAgo = startOfDay(subDays(now, 30))
  const sevenDaysAgo = startOfDay(subDays(now, 7))

  // ── Fetch raw data ─────────────────────────────────────────────
  const [activeWorkers, allSites, last30Records, last7Records] = await Promise.all([
    prisma.user.count({ where: { isActive: true, role: { not: 'ADMIN' } } }),

    prisma.site.findMany({
      where: { isActive: true },
      include: {
        employeeAssignments: { where: { isActive: true } },
        attendanceRecords: {
          where: { date: { gte: sevenDaysAgo } },
          select: { status: true, date: true },
        },
      },
    }),

    prisma.attendanceRecord.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      select: { status: true, date: true, siteId: true },
    }),

    prisma.attendanceRecord.findMany({
      where: { date: { gte: sevenDaysAgo } },
      select: { status: true, date: true, siteId: true },
    }),
  ])

  // ── KPI calculations ────────────────────────────────────────────
  const totalWorkersOnPayroll = activeWorkers

  // Count workdays (Mon–Sat) in the last 30 days
  let workdays = 0
  for (let i = 0; i < 30; i++) {
    const d = subDays(now, i)
    const dow = d.getDay()
    if (dow !== 0) workdays++ // exclude Sunday
  }

  const presentStatuses = ['PRESENT', 'LATE', 'HALF_DAY', 'TRAVEL_DUTY', 'MANUAL_OVERRIDE']
  const absentStatuses = ['ABSENT']

  const totalPresent = last30Records.filter((r) => presentStatuses.includes(r.status)).length
  const totalAbsent = last30Records.filter((r) => absentStatuses.includes(r.status)).length

  const totalExpected = Math.max(1, workdays * totalWorkersOnPayroll)
  const avgAttendanceRate = Math.min(100, Math.round((totalPresent / totalExpected) * 100))

  const lostHoursEstimate = totalAbsent * 8
  const lostRevenueEstimate = lostHoursEstimate * 350

  // ── Sites at Risk (< 60% attendance last 7 days) ─────────────────
  const sitesAtRisk = allSites
    .map((site) => {
      const assigned = site.employeeAssignments.length
      if (assigned === 0) return null
      const presentCount = site.attendanceRecords.filter((r) =>
        presentStatuses.includes(r.status)
      ).length
      // unique days in last 7 days
      const uniqueDays = new Set(
        site.attendanceRecords.map((r) => new Date(r.date).toDateString())
      ).size
      const expectedSite = Math.max(1, assigned * Math.max(1, uniqueDays))
      const rate = Math.round((presentCount / expectedSite) * 100)
      if (rate >= 60) return null
      return {
        siteId: site.id,
        siteName: site.name,
        assignedWorkers: assigned,
        attendanceRate: rate,
        risk: (rate < 40 ? 'Critical' : 'Warning') as 'Critical' | 'Warning',
      }
    })
    .filter(Boolean) as {
    siteId: string
    siteName: string
    assignedWorkers: number
    attendanceRate: number
    risk: 'Critical' | 'Warning'
  }[]

  // ── Top Performing Sites ─────────────────────────────────────────
  const sitePerformance = allSites
    .map((site) => {
      const assigned = site.employeeAssignments.length
      if (assigned === 0) return null
      // Use last 30 days from the main records filtered by siteId
      const siteRecords = last30Records.filter((r) => r.siteId === site.id)
      const presentCount = siteRecords.filter((r) => presentStatuses.includes(r.status)).length
      const uniqueDays = new Set(siteRecords.map((r) => new Date(r.date).toDateString())).size
      const expectedSite = Math.max(1, assigned * Math.max(1, uniqueDays))
      const rate = Math.min(100, Math.round((presentCount / expectedSite) * 100))
      return { siteName: site.name, attendanceRate: rate, assignedWorkers: assigned }
    })
    .filter(Boolean)
    .sort((a, b) => b!.attendanceRate - a!.attendanceRate)
    .slice(0, 3) as { siteName: string; attendanceRate: number; assignedWorkers: number }[]

  // ── Weekly Trend (attendances grouped by day-of-week, last 30 days) ──
  const weeklyTrendMap: Record<string, number> = {}
  DAY_LABELS.forEach((d) => { weeklyTrendMap[d] = 0 })

  for (const record of last30Records) {
    if (presentStatuses.includes(record.status)) {
      const jsDay = new Date(record.date).getDay()
      const label = jsDoWToLabel(jsDay)
      weeklyTrendMap[label] = (weeklyTrendMap[label] ?? 0) + 1
    }
  }

  const weeklyTrend = DAY_LABELS.map((day) => ({ day, count: weeklyTrendMap[day] ?? 0 }))

  // ── Absence Heatmap (absences per day-of-week) ───────────────────
  const heatmapMap: Record<string, number> = {}
  DAY_LABELS.forEach((d) => { heatmapMap[d] = 0 })

  for (const record of last30Records) {
    if (absentStatuses.includes(record.status)) {
      const jsDay = new Date(record.date).getDay()
      const label = jsDoWToLabel(jsDay)
      heatmapMap[label] = (heatmapMap[label] ?? 0) + 1
    }
  }

  const absenceHeatmap = DAY_LABELS.map((day) => ({ day, absences: heatmapMap[day] ?? 0 }))

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Analytics"
          title="Executive Workforce Insights"
          description="Aggregated workforce performance indicators for the last 30 days."
        />
        <InsightsDashboard
          totalWorkersOnPayroll={totalWorkersOnPayroll}
          avgAttendanceRate={avgAttendanceRate}
          lostHoursEstimate={lostHoursEstimate}
          lostRevenueEstimate={lostRevenueEstimate}
          sitesAtRisk={sitesAtRisk}
          topPerformingSites={sitePerformance}
          weeklyTrend={weeklyTrend}
          absenceHeatmap={absenceHeatmap}
        />
      </div>
    </PageShell>
  )
}
