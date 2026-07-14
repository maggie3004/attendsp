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
      select: {
        id: true,
        status: true,
        checkInTime: true,
        checkOutTime: true,
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

  const exceptionsToday = (statsByStatus['LATE'] ?? 0) + (statsByStatus['ABSENT'] ?? 0)
  let sitesAtRisk = 0

  const processedSites = sites.map(site => {
    const total = site._count.employeeAssignments
    const present = site.attendanceRecords.filter(r => ['PRESENT', 'LATE', 'HALF_DAY'].includes(r.status)).length
    const coverage = total > 0 ? (present / total) * 100 : 0
    if (total > 0 && coverage < 75) sitesAtRisk++
    return { ...site, coverage, present, total }
  })

  // Sort sites by risk (lowest coverage first)
  processedSites.sort((a, b) => a.coverage - b.coverage)

  // Filter recent attendance for anomalies only (Late, Absent)
  // Or we can just mock the priority alerts
  const priorityAlerts = recentAttendance.filter(r => ['LATE', 'ABSENT'].includes(r.status))

  return {
    totalEmployees,
    presentToday: presentCount,
    lateToday: statsByStatus['LATE'] ?? 0,
    absentToday: statsByStatus['ABSENT'] ?? 0,
    exceptionsToday,
    sitesAtRisk,
    operationalIssues: 3, // Mocked as requested
    activeSites: sites.length,
    pendingLeaves: leaveRequests,
    sites: processedSites,
    recentAttendance,
    priorityAlerts,
    statsByStatus,
  }
}

export default async function DashboardPage() {
  const [session, data] = await Promise.all([auth(), getDashboardData()])

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Super Admin'
  const coverage = data.totalEmployees > 0 ? Math.round((data.presentToday / data.totalEmployees) * 100) : 0

  return <DashboardContent firstName={firstName} coverage={coverage} data={data} />
}

