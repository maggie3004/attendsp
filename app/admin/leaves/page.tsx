import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { LeavesPanel } from '@/components/admin/leaves/LeavesPanel'

export const metadata: Metadata = { title: 'Leave Requests' }

export default async function LeavesPage() {
  const pendingLeaves = await prisma.leaveRequest.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, employeeId: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Leave Requests</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {pendingLeaves.length} pending {pendingLeaves.length === 1 ? 'request' : 'requests'}
        </p>
      </div>
      <LeavesPanel initialPending={pendingLeaves} />
    </div>
  )
}
