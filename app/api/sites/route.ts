import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createSiteSchema, updateSiteSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { generateSiteCode } from '@/lib/utils'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const sites = await prisma.site.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { employeeAssignments: { where: { isActive: true } } },
        },
      },
    })
    return NextResponse.json({ success: true, data: sites })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = createSiteSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const count = await prisma.site.count()
    const code = generateSiteCode(count)

    const site = await prisma.site.create({
      data: { ...parsed.data, code },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'CREATE',
      targetTable: 'sites',
      targetId: site.id,
      newValues: { name: site.name, code: site.code },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: site }, { status: 201 })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
