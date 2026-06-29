import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { markAttendanceSchema } from '@/lib/validations'
import { findMatchingSite } from '@/lib/gps'
import { determineCheckInStatus } from '@/lib/attendance-rules'
import { uploadImage } from '@/lib/storage'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { startOfDay, endOfDay } from 'date-fns'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = markAttendanceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }

    const { captureImage, latitude, longitude, accuracy, timestamp, deviceId, isOffline, offlineChecksum } = parsed.data

    // ── Duplicate check: offline sync dedup ──────────────────
    if (isOffline && offlineChecksum) {
      const existing = await prisma.offlineQueue.findUnique({ where: { checksum: offlineChecksum } })
      if (existing?.status === 'SYNCED') {
        return NextResponse.json({ success: true, message: 'Already synced', data: null })
      }
    }

    const today = new Date(timestamp)
    const dayStart = startOfDay(today)
    const dayEnd = endOfDay(today)

    // ── Duplicate attendance check ────────────────────────────
    const existingRecord = await prisma.attendanceRecord.findFirst({
      where: { userId: session.user.id, date: { gte: dayStart, lte: dayEnd } },
    })

    if (existingRecord?.checkInTime && !existingRecord.checkOutTime) {
      // Second scan = check-out
      const updated = await prisma.attendanceRecord.update({
        where: { id: existingRecord.id },
        data: {
          checkOutTime: today,
          checkOutLat: latitude,
          checkOutLng: longitude,
          checkOutAccuracy: accuracy,
        },
      })
      return NextResponse.json({ success: true, message: 'Checked out', data: { record: updated } })
    }

    if (existingRecord?.checkInTime && existingRecord.checkOutTime) {
      return NextResponse.json({
        success: false,
        error: 'Attendance already marked for today. Contact admin for corrections.',
      }, { status: 409 })
    }

    // ── Fetch user with face descriptor & site assignments ─────
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        faceDescriptor: true,
        employee: {
          include: {
            siteAssignments: {
              where: { isActive: true },
              include: { site: true },
            },
          },
        },
      },
    })

    if (!user?.faceDescriptor || user.faceDescriptor.length === 0) {
      return NextResponse.json({ success: false, error: 'Face not registered. Please contact admin.' }, { status: 422 })
    }

    // ── Face verification ─────────────────────────────────────
    // Note: face-api.js runs client-side. The client sends the descriptor separately.
    // Here we trust the client sent a valid descriptor with the image.
    // For production, consider a server-side face comparison step.
    const faceConfidence = (body.faceConfidence as number | undefined) ?? null
    const faceVerified = faceConfidence !== null ? faceConfidence >= 0.6 : true // fallback trusts client check

    if (faceConfidence !== null && faceConfidence < 0.6) {
      return NextResponse.json({
        success: false,
        error: `Face verification failed (confidence: ${Math.round(faceConfidence * 100)}%). Ensure good lighting and look directly at the camera.`,
      }, { status: 422 })
    }

    // ── GPS + Geofence check ──────────────────────────────────
    const sites = user.employee?.siteAssignments.map((a) => a.site) ?? []
    const matchedSite = sites.length > 0
      ? findMatchingSite(latitude, longitude, sites)
      : null

    let resolvedSiteId: string | null = matchedSite?.site.id ?? null
    let isWrongSite = false
    let flagReason: string | null = null

    // Check if worker is on travel duty
    const travelDuty = await prisma.travelDuty.findFirst({
      where: {
        userId: session.user.id,
        status: 'APPROVED',
        startDate: { lte: today },
        endDate: { gte: today },
      },
    })

    const onTravelDuty = !!travelDuty

    if (!onTravelDuty && sites.length > 0 && !matchedSite) {
      // Worker is outside all assigned geofences
      isWrongSite = true
      flagReason = `Worker is ${Math.round(
        Math.min(...sites.map((s) =>
          Math.sqrt(Math.pow(latitude - s.latitude, 2) + Math.pow(longitude - s.longitude, 2)) * 111000
        ))
      )}m from nearest assigned site`
    }

    // ── Determine site timing config ──────────────────────────
    const globalSettings = await prisma.globalSettings.findFirst()
    const siteConfig = matchedSite?.site ?? null

    const rulesConfig = {
      startTime: siteConfig?.startTime ?? globalSettings?.defaultStartTime ?? '09:00',
      endTime: siteConfig?.endTime ?? globalSettings?.defaultEndTime ?? '18:00',
      lateThresholdMins: siteConfig?.lateThresholdMins ?? globalSettings?.defaultLateThresholdMins ?? 15,
      halfDayThresholdMins: siteConfig?.halfDayThresholdMins ?? globalSettings?.defaultHalfDayThresholdMins ?? 240,
      absentThresholdMins: globalSettings?.defaultAbsentThresholdMins ?? 480,
    }

    // ── Check for approved leave ──────────────────────────────
    const approvedLeave = await prisma.leaveRequest.findFirst({
      where: {
        userId: session.user.id,
        status: 'APPROVED',
        startDate: { lte: today },
        endDate: { gte: today },
      },
    })

    let status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'TRAVEL_DUTY' | 'LEAVE' = 'PRESENT'

    if (approvedLeave) {
      status = 'LEAVE'
    } else if (onTravelDuty) {
      status = 'TRAVEL_DUTY'
    } else {
      const result = determineCheckInStatus(today, rulesConfig)
      status = result.status as typeof status
    }

    // ── Save capture image ────────────────────────────────────
    let captureImageUrl: string | null = null
    try {
      const filename = `${session.user.id}-${Date.now()}`
      const uploaded = await uploadImage(captureImage, 'attendance', filename)
      captureImageUrl = uploaded.url
    } catch {
      // Image upload failure is non-fatal — log and continue
      console.error('[Attendance] Image upload failed')
    }

    // ── Create attendance record ──────────────────────────────
    const record = await prisma.attendanceRecord.create({
      data: {
        userId: session.user.id,
        siteId: resolvedSiteId,
        date: dayStart,
        checkInTime: today,
        status,
        checkInLat: latitude,
        checkInLng: longitude,
        checkInAccuracy: accuracy,
        gpsDistanceMeters: matchedSite?.distanceMeters ?? null,
        faceConfidence,
        faceVerified,
        captureImageUrl,
        isTravelDuty: onTravelDuty,
        isWrongSite,
        flagReason,
      },
      include: { site: { select: { id: true, name: true, code: true } } },
    })

    // ── Audit log ─────────────────────────────────────────────
    await createAuditLog({
      actorId: session.user.id,
      action: 'ATTENDANCE_MARK',
      targetTable: 'attendance_records',
      targetId: record.id,
      newValues: { status, siteId: resolvedSiteId, isWrongSite },
      ipAddress: getClientIp(req),
    })

    // ── Mark offline queue synced ─────────────────────────────
    if (isOffline && offlineChecksum) {
      await prisma.offlineQueue.upsert({
        where: { checksum: offlineChecksum },
        create: {
          deviceId: deviceId ?? 'unknown',
          userId: session.user.id,
          payload: body,
          status: 'SYNCED',
          checksum: offlineChecksum,
          syncedAt: new Date(),
          createdAt: new Date(timestamp),
        },
        update: { status: 'SYNCED', syncedAt: new Date() },
      })
    }

    return NextResponse.json({
      success: true,
      message: isWrongSite ? 'Attendance marked but you are outside your assigned site radius. Admin has been notified.' : 'Attendance marked successfully',
      data: {
        recordId: record.id,
        status: record.status,
        checkInTime: record.checkInTime,
        site: record.site,
        distanceMeters: matchedSite?.distanceMeters,
        isWrongSite,
        onTravelDuty,
        flagReason,
      },
    })
  } catch (error) {
    console.error('[Attendance API]', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get('from') ?? new Date().toISOString().slice(0, 10)
    const dateTo = searchParams.get('to') ?? dateFrom
    const userId = searchParams.get('userId') ?? session.user.id

    // Only admins can view other users' attendance
    if (userId !== session.user.id && session.user.role === 'WORKER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const records = await prisma.attendanceRecord.findMany({
      where: {
        userId,
        date: { gte: new Date(dateFrom), lte: new Date(dateTo) },
      },
      orderBy: { date: 'desc' },
      include: {
        user: { select: { name: true, employeeId: true } },
        site: { select: { name: true, code: true } },
      },
    })

    return NextResponse.json({ success: true, data: records })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
