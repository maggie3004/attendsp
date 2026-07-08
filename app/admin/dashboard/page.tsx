import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { startOfDay, endOfDay } from 'date-fns'
import { DashboardContent } from '@/components/admin/DashboardContent'

export const metadata: Metadata = { title: 'Dashboard' }

async function getDashboardData() {
  const today = new Date()
  const dayStart = startOfDay(today)
  const dayEnd = endOfDay(today)

  const [totalEmployees, todayAttendance, sites, recentAttendance, leaveRequests] = await Promise.all([
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
    prisma.leaveRequest.count({
      where: { status: 'PENDING' },
    }),
  ])

  const statsByStatus: Record<string, number> = {}
  for (const row of todayAttendance) {
    statsByStatus[row.status] = row._count.status
  }

  const presentCount = (statsByStatus['PRESENT'] ?? 0) + (statsByStatus['LATE'] ?? 0) + (statsByStatus['HALF_DAY'] ?? 0)

  return {
    totalEmployees,
    presentToday: presentCount,
    lateToday: statsByStatus['LATE'] ?? 0,
    absentToday: statsByStatus['ABSENT'] ?? 0,
    activeSites: sites.length,
    pendingLeaves: leaveRequests,
    sites,
    recentAttendance,
    statsByStatus,
  }
}

export default async function DashboardPage() {
  const [session, data] = await Promise.all([auth(), getDashboardData()])

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Super Admin'
  const coverage = data.totalEmployees > 0 ? Math.round((data.presentToday / data.totalEmployees) * 100) : 0

  return <DashboardContent firstName={firstName} coverage={coverage} data={data} />
}

