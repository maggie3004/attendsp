import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { createEmployeeSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { generateEmployeeId } from '@/lib/utils'
import bcrypt from 'bcryptjs'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role === 'WORKER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const siteId = searchParams.get('siteId') ?? searchParams.get('site')
    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const face = searchParams.get('face')
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20')

    const whereConditions: any[] = []

    if (search) {
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { employeeId: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search } },
        ],
      })
    }

    if (role) {
      whereConditions.push({ role: role as 'SUPER_ADMIN' | 'ADMIN' | 'SUPERVISOR' | 'WORKER' })
    }

    if (siteId) {
      whereConditions.push({
        employee: {
          siteAssignments: {
            some: { siteId, isActive: true },
          },
        },
      })
    }

    if (status) {
      if (status === 'active') {
        whereConditions.push({ isActive: true })
      } else if (status === 'inactive' || status === 'suspended') {
        whereConditions.push({ isActive: false })
      }
    }

    if (face) {
      if (face === 'registered') {
        whereConditions.push({ faceRegisteredAt: { not: null } })
      } else if (face === 'pending' || face === 'missing') {
        whereConditions.push({ faceRegisteredAt: null })
      }
    }

    const where = whereConditions.length > 0 ? { AND: whereConditions } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          employeeId: true,
          name: true,
          phone: true,
          email: true,
          role: true,
          isActive: true,
          designation: true,
          department: true,
          profileImageUrl: true,
          faceRegisteredAt: true,
          createdAt: true,
          employee: {
            select: {
              siteAssignments: {
                where: { isActive: true },
                select: { site: { select: { id: true, name: true, code: true } }, isPrimary: true },
              },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
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
    const parsed = createEmployeeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const { name, phone, email, pin, role, designation, department, joiningDate, primarySiteId } = parsed.data

    // Generate employee ID
    const count = await prisma.user.count()
    const employeeId = generateEmployeeId(count)

    // Hash PIN
    const pinHash = await bcrypt.hash(pin, 12)

    const user = await prisma.user.create({
      data: {
        employeeId,
        name,
        phone: phone ?? null,
        email: email || null,
        pinHash,
        role,
        designation: designation ?? null,
        department: department ?? null,
        employee: {
          create: {
            joiningDate: joiningDate ? new Date(joiningDate) : null,
            siteAssignments: primarySiteId ? {
              create: {
                siteId: primarySiteId,
                isPrimary: true,
              },
            } : undefined,
          },
        },
      },
      select: {
        id: true,
        employeeId: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    await createAuditLog({
      actorId: session.user.id,
      action: 'CREATE',
      targetTable: 'users',
      targetId: user.id,
      newValues: { employeeId, name, role },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === 'P2002'
    ) {
      return NextResponse.json({ success: false, error: 'Phone or email already exists' }, { status: 409 })
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
