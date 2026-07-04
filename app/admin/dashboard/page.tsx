import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { startOfDay, endOfDay } from 'date-fns'
import { DashboardStats } from '@/components/admin/DashboardStats'
import { RecentAttendance } from '@/components/admin/RecentAttendance'
import { SiteBreakdown } from '@/components/admin/SiteBreakdown'
import { AttendanceTrendChart } from '@/components/admin/charts/AttendanceTrendChart'

export const metadata: Metadata = { title: 'Dashboard' }

async function getDashboardData() {
  const today = new Date()
  const dayStart = startOfDay(today)
  const dayEnd = endOfDay(today)

  const [
    totalEmployees,
    todayAttendance,
    sites,
    recentAttendance,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'WORKER', isActive: true } }),
    prisma.attendanceRecord.groupBy({
      by: ['status'],
      where: { date: { gte: dayStart, lte: dayEnd } },
      _count: { status: true },
    }),
    prisma.site.findMany({
      where: { isActive: true },
      include: {
        _count: { select: { employeeAssignments: { where: { isActive: true } } } },
        attendanceRecords: {
          where: { date: { gte: dayStart, lte: dayEnd } },
          select: { status: true },
        },
      },
    }),
    prisma.attendanceRecord.findMany({
      where: { date: { gte: dayStart, lte: dayEnd } },
      orderBy: { checkInTime: 'desc' },
      take: 10,
      include: {
        user: { select: { id: true, name: true, employeeId: true, profileImageUrl: true } },
        site: { select: { id: true, name: true, code: true } },
      },
    }),
  ])

  // Build stats map
  const statsByStatus: Record<string, number> = {}
  for (const row of todayAttendance) {
    statsByStatus[row.status] = row._count.status
  }

  const presentCount = (statsByStatus['PRESENT'] ?? 0) + (statsByStatus['LATE'] ?? 0) + (statsByStatus['HALF_DAY'] ?? 0)

  return {
    totalEmployees,
    presentToday: presentCount,
    lateToday: statsByStatus['LATE'] ?? 0,
    halfDayToday: statsByStatus['HALF_DAY'] ?? 0,
    absentToday: statsByStatus['ABSENT'] ?? 0,
    onLeave: statsByStatus['LEAVE'] ?? 0,
    travelDuty: statsByStatus['TRAVEL_DUTY'] ?? 0,
    sites,
    recentAttendance,
    statsByStatus,
  }
}

export default async function DashboardPage() {
  const [session, data] = await Promise.all([auth(), getDashboardData()])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Welcome back, {session?.user?.name?.split(' ')[0]} — here is today&apos;s overview
        </p>
      </div>

      {/* Stats Grid */}
      <DashboardStats data={data} />

      {/* Charts + Site Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendanceTrendChart />
        </div>
        <div>
          <SiteBreakdown sites={data.sites} />
        </div>
      </div>

      {/* Recent Attendance */}
      <RecentAttendance records={data.recentAttendance} />
    </div>
  )
}
