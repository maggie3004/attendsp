import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { subDays, format, startOfDay, endOfDay } from 'date-fns'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '7')

  const data = await Promise.all(
    Array.from({ length: days }, (_, i) => {
      const date = subDays(new Date(), days - 1 - i)
      return prisma.attendanceRecord.groupBy({
        by: ['status'],
        where: { date: { gte: startOfDay(date), lte: endOfDay(date) } },
        _count: { status: true },
      }).then((rows) => {
        const byStatus: Record<string, number> = {}
        for (const row of rows) byStatus[row.status] = row._count.status
        return {
          date: format(date, 'dd MMM'),
          present: (byStatus['PRESENT'] ?? 0) + (byStatus['LATE'] ?? 0),
          late: byStatus['LATE'] ?? 0,
          absent: byStatus['ABSENT'] ?? 0,
        }
      })
    })
  )

  return NextResponse.json({ success: true, data })
}
