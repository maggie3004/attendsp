import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { WorkerHistoryList } from '@/components/worker/WorkerHistoryList'
import { startOfMonth, endOfMonth } from 'date-fns'
import { CalendarDays } from 'lucide-react'

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
    <div className="px-4 py-6 space-y-6 animate-fade-in">
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
            <CalendarDays className="h-5 w-5 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
        </div>
        <p className="text-sm text-slate-500 mt-2">This month&apos;s records</p>
      </div>
      <WorkerHistoryList records={records} />
    </div>
  )
}
