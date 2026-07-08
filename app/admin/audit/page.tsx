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
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-semibold text-slate-900">Audit Logs</h1>
        <p className="text-sm text-slate-500 mt-1">Immutable record of all system actions — last 100 entries</p>
      </div>
      <AuditLogTable logs={logs} />
    </div>
  )
}
