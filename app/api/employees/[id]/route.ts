import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { z } from 'zod'
import { createAuditLog, getClientIp } from '@/lib/audit'

type RouteContext = { params: Promise<{ id: string }> }

const patchSchema = z.object({
  isActive: z.boolean().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
})

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user?.id || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = patchSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })

    const update = {} as any
    if (typeof parsed.data.isActive === 'boolean') update.isActive = parsed.data.isActive
    if (typeof parsed.data.name === 'string') update.name = parsed.data.name
    if (typeof parsed.data.phone === 'string') update.phone = parsed.data.phone
    if (typeof parsed.data.email === 'string') update.email = parsed.data.email

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })

    const updated = await prisma.user.update({ where: { id }, data: update })

    await createAuditLog({
      actorId: session.user.id,
      targetUserId: id,
      action: 'UPDATE',
      targetTable: 'users',
      targetId: id,
      oldValues: { isActive: existing.isActive },
      newValues: { isActive: updated.isActive },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: { id: updated.id, isActive: updated.isActive } })
  } catch (e) {
    console.error('[Employees PATCH]', e)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
