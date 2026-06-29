import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { attendanceOverrideSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role === 'WORKER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = attendanceOverrideSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const existing = await prisma.attendanceRecord.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ success: false, error: 'Attendance record not found' }, { status: 404 })

    const { newStatus, newCheckIn, newCheckOut, reason, notes } = parsed.data

    // Create correction record BEFORE updating (immutable history)
    await prisma.attendanceCorrection.create({
      data: {
        attendanceId: params.id,
        correctedById: session.user.id,
        previousStatus: existing.status,
        newStatus,
        previousCheckIn: existing.checkInTime,
        newCheckIn: newCheckIn ? new Date(newCheckIn) : undefined,
        previousCheckOut: existing.checkOutTime,
        newCheckOut: newCheckOut ? new Date(newCheckOut) : undefined,
        reason,
        notes,
      },
    })

    // Update the attendance record
    const updated = await prisma.attendanceRecord.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        checkInTime: newCheckIn ? new Date(newCheckIn) : undefined,
        checkOutTime: newCheckOut ? new Date(newCheckOut) : undefined,
        isManualOverride: true,
        flagReason: `Manual override by ${session.user.name}: ${reason}`,
      },
    })

    await createAuditLog({
      actorId: session.user.id,
      targetUserId: existing.userId,
      action: 'ATTENDANCE_OVERRIDE',
      targetTable: 'attendance_records',
      targetId: params.id,
      oldValues: { status: existing.status, checkInTime: existing.checkInTime },
      newValues: { status: newStatus, checkInTime: newCheckIn, reason },
      reason,
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: updated })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
