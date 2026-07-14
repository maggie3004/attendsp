import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role === 'WORKER') {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const [totalWorkers, supervisors] = await Promise.all([
      prisma.user.count({ where: { role: 'WORKER', isActive: true } }),
      prisma.user.count({ where: { role: 'SUPERVISOR', isActive: true } }),
    ])

    // In a fully built architecture, presentToday and absentToday would be 
    // calculated by joining the Attendance/Time tracking services.
    // For now, we return null to signify "Not Available" instead of fabricating metrics.

    return NextResponse.json({
      success: true,
      data: {
        totalWorkers,
        supervisors,
        presentToday: null,
        absentToday: null,
      }
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
