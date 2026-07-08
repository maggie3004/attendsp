import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { updateSettingsSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = updateSettingsSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const settings = await prisma.globalSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...parsed.data, updatedById: session.user.id },
      update: { ...parsed.data, updatedById: session.user.id },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'SETTINGS_UPDATE',
      targetTable: 'global_settings',
      targetId: 'default',
      newValues: parsed.data as Record<string, unknown>,
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: settings })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
