import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { LeavesPanel } from '@/components/admin/leaves/LeavesPanel'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, StatsCard } from '@/components/ui/DesignSystem'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'

export const metadata: Metadata = { title: 'Leave Requests' }

export default async function LeavesPage() {
  const [pendingLeaves, approvedCount, rejectedCount] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, employeeId: true } } },
    }),
    prisma.leaveRequest.count({ where: { status: 'APPROVED' } }),
    prisma.leaveRequest.count({ where: { status: 'REJECTED' } }),
  ])

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Leave management"
          title="Leave Requests"
          description={`${pendingLeaves.length} pending ${pendingLeaves.length === 1 ? 'request' : 'requests'} awaiting review.`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            label="Pending"
            value={pendingLeaves.length}
            icon={<Clock className="h-5 w-5 text-amber-600" />}
            tone="bg-amber-50"
            change="Awaiting review"
          />
          <StatsCard
            label="Approved"
            value={approvedCount}
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            tone="bg-emerald-50"
            change="All time"
          />
          <StatsCard
            label="Rejected"
            value={rejectedCount}
            icon={<XCircle className="h-5 w-5 text-red-600" />}
            tone="bg-red-50"
            change="All time"
          />
        </div>

        <LeavesPanel initialPending={pendingLeaves} />
      </div>
    </PageShell>
  )
}
