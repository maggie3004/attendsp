import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { startOfDay, endOfDay, format } from 'date-fns'
import { WorkerHomeContent } from '@/components/worker/WorkerHomeContent'

export default async function WorkerPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const today = new Date()
  const dayStart = startOfDay(today)
  const dayEnd = endOfDay(today)

  // Fetch user with employee data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      employee: {
        include: {
          siteAssignments: {
            where: { isActive: true },
            include: { site: true }
          }
        }
      }
    }
  })

  // Fetch today's attendance
  const todayAttendance = await prisma.attendanceRecord.findFirst({
    where: {
      userId: session.user.id,
      date: { gte: dayStart, lte: dayEnd }
    },
    include: {
      site: true
    }
  })

  // Fetch attendance stats for worker
  const totalDays = await prisma.attendanceRecord.count({
    where: { userId: session.user.id }
  })

  const presentDays = await prisma.attendanceRecord.count({
    where: {
      userId: session.user.id,
      status: { in: ['PRESENT', 'LATE', 'HALF_DAY'] }
    }
  })

  const absentDays = await prisma.attendanceRecord.count({
    where: {
      userId: session.user.id,
      status: 'ABSENT'
    }
  })

  const pendingLeaves = await prisma.leaveRequest.count({
    where: {
      userId: session.user.id,
      status: 'PENDING'
    }
  })

  // Fetch pending leave requests for approvals
  const approvalLeaves = await prisma.leaveRequest.findMany({
    where: {
      userId: session.user.id,
      status: 'PENDING'
    },
    take: 3
  })

  // Fetch recent attendance records
  const recentRecords = await prisma.attendanceRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 5,
    include: {
      site: true
    }
  })

  const firstName = user?.name?.split(' ')[0] ?? 'Worker'
  const dateStr = format(today, 'EEEE, d MMMM yyyy')

  return (
    <WorkerHomeContent
      firstName={firstName}
      date={dateStr}
      todayAttendance={todayAttendance}
      stats={{
        totalDays,
        presentDays,
        absentDays,
        pendingLeaves
      }}
      approvalLeaves={approvalLeaves}
      recentRecords={recentRecords}
    />
  )
}
