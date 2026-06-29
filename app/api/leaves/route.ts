import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { applyLeaveSchema, respondLeaveSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { differenceInCalendarDays } from 'date-fns'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const isAdmin = session.user.role !== 'WORKER'

    const leaves = await prisma.leaveRequest.findMany({
      where: {
        ...(isAdmin ? {} : { userId: session.user.id }),
        ...(status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, employeeId: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    })
    return NextResponse.json({ success: true, data: leaves })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = applyLeaveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const { type, startDate, endDate, reason, isEmergency } = parsed.data
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = differenceInCalendarDays(end, start) + 1

    // Check for overlapping leave
    const overlap = await prisma.leaveRequest.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['PENDING', 'APPROVED'] },
        OR: [
          { startDate: { lte: end }, endDate: { gte: start } },
        ],
      },
    })
    if (overlap) {
      return NextResponse.json({ success: false, error: 'You have an overlapping leave request for these dates.' }, { status: 409 })
    }

    const leave = await prisma.leaveRequest.create({
      data: {
        userId: session.user.id,
        type,
        startDate: start,
        endDate: end,
        totalDays,
        reason,
        isEmergency,
      },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'LEAVE_APPLY',
      targetTable: 'leave_requests',
      targetId: leave.id,
      newValues: { type, startDate, endDate, totalDays },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: leave }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
