import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { uploadImage } from '@/lib/storage'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { z } from 'zod'

const faceSchema = z.object({
  faceImage: z.string().min(1), // base64
  faceDescriptor: z.array(z.number()).length(128), // 128-dimensional embedding
})

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id || !['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR'].includes(session.user.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const parsed = faceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid face data' }, { status: 400 })
    }

    const { faceImage, faceDescriptor } = parsed.data

    // Get existing user for audit
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { faceRegisteredAt: true, profileImageUrl: true },
    })

    // Upload face image to storage
    const filename = `face-${params.id}-${Date.now()}`
    const { url } = await uploadImage(faceImage, 'faces', filename)

    // Update user with face descriptor and image
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        faceDescriptor,
        profileImageUrl: url,
        faceRegisteredAt: existingUser?.faceRegisteredAt ?? new Date(),
        faceUpdatedAt: new Date(),
      },
      select: { id: true, name: true, faceRegisteredAt: true, profileImageUrl: true },
    })

    await createAuditLog({
      actorId: session.user.id,
      targetUserId: params.id,
      action: existingUser?.faceRegisteredAt ? 'FACE_UPDATE' : 'FACE_REGISTER',
      targetTable: 'users',
      targetId: params.id,
      newValues: { faceRegisteredAt: user.faceRegisteredAt },
      ipAddress: getClientIp(req),
    })

    return NextResponse.json({ success: true, data: user })
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
