import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { AuditLogTable } from '@/components/admin/audit/AuditLogTable'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader } from '@/components/ui/DesignSystem'

export const metadata: Metadata = { title: 'Audit Logs' }

export default async function AuditPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      actor: { select: { name: true, employeeId: true } },
      targetUser: { select: { name: true, employeeId: true } },
    },
  })

  return (
    <PageShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="System activity"
          title="Audit Logs"
          description="Immutable record of all system actions — last 100 entries."
        />
        <AuditLogTable logs={logs} />
      </div>
    </PageShell>
  )
}
