import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WorkerHistoryList } from '@/components/worker/WorkerHistoryList'
import { startOfMonth, endOfMonth } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

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
    <div className="flex flex-col gap-7 px-5 pt-6 pb-10 animate-fade-in">
      <WorkerHistoryList records={records} />
    </div>
  )
}
