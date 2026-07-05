import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { respondLeaveSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params

    const session = await auth()
    if (!session?.user?.id || session.user.role === 'WORKER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = respondLeaveSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const existing = await prisma.leaveRequest.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ success: false, error: 'Leave request not found' }, { status: 404 })
    if (existing.status !== 'PENDING') {
      return NextResponse.json({ success: false, error: 'Leave request already responded to' }, { status: 409 })
    }

    const updated = await prisma.leaveRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        approvedById: session.user.id,
        approverNote: parsed.data.approverNote,
        respondedAt: new Date(),
      },
    })

    await createAuditLog({
      actorId: session.user.id,
      targetUserId: existing.userId,
      action: parsed.data.status === 'APPROVED' ? 'LEAVE_APPROVE' : 'LEAVE_REJECT',
      targetTable: 'leave_requests',
      targetId: id,
      oldValues: { status: existing.status },
      newValues: { status: parsed.data.status, note: parsed.data.approverNote },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
