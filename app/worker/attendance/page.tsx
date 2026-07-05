import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { startOfDay, endOfDay } from 'date-fns'
import { WorkerAttendanceFlow } from '@/components/worker/attendance/WorkerAttendanceFlow'

export default async function WorkerAttendancePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const today = new Date()
  const dayStart = startOfDay(today)
  const dayEnd = endOfDay(today)

  // Fetch the worker's today attendance status
  const todayRecord = await prisma.attendanceRecord.findFirst({
    where: {
      userId: session.user.id,
      date: { gte: dayStart, lte: dayEnd }
    }
  })

  // Fetch recent attendance (last 3)
  const recentRecords = await prisma.attendanceRecord.findMany({
    where: { userId: session.user.id },
    orderBy: { date: 'desc' },
    take: 3,
  })

  // Fetch user site assignment and global settings for shift timing
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

  const globalSettings = await prisma.globalSettings.findFirst()

  const assignedSite = user?.employee?.siteAssignments[0]?.site?.name ?? null
  const siteConfig = user?.employee?.siteAssignments[0]?.site ?? null

  const startTime = siteConfig?.startTime ?? globalSettings?.defaultStartTime ?? '09:00'
  const endTime = siteConfig?.endTime ?? globalSettings?.defaultEndTime ?? '18:00'
  const shiftTiming = `${startTime} - ${endTime}`

  return (
    <WorkerAttendanceFlow 
      userName={session.user.name?.split(' ')[0] ?? 'User'}
      todayStatus={todayRecord?.status ?? null}
      assignedSite={assignedSite}
      shiftTiming={shiftTiming}
      recentRecords={recentRecords}
    />
  )
}
