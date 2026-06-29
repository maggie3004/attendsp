import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WorkerHistoryList } from '@/components/worker/WorkerHistoryList'
import { startOfMonth, endOfMonth } from 'date-fns'

export const metadata: Metadata = { title: 'My Attendance History' }

export default async function WorkerHistoryPage() {
  const session = await auth()
  if (!session?.user) return null

  const records = await prisma.attendanceRecord.findMany({
    where: {
      userId: session.user.id,
      date: {
        gte: startOfMonth(new Date()),
        lte: endOfMonth(new Date()),
      },
    },
    orderBy: { date: 'desc' },
    include: { site: { select: { name: true, code: true } } },
  })

  return (
    <div className="px-4 py-6 space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold">My Attendance</h1>
        <p className="text-sm text-foreground/50 mt-0.5">This month&apos;s records</p>
      </div>
      <WorkerHistoryList records={records} />
    </div>
  )
}
