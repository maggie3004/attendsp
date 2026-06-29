import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { AuditLogTable } from '@/components/admin/audit/AuditLogTable'

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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Immutable record of all system actions — last 100 entries</p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  )
}
