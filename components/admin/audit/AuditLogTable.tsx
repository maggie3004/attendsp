import { formatDateTime, timeAgo, cn } from '@/lib/utils'
import type { AuditAction } from '@prisma/client'

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  CREATE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  UPDATE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
  ATTENDANCE_MARK: 'text-blue-600 bg-blue-50 border-blue-200',
  ATTENDANCE_OVERRIDE: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  FACE_REGISTER: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  FACE_UPDATE: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  LEAVE_APPROVE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  LEAVE_REJECT: 'text-red-400 bg-red-500/10 border-red-500/20',
}

interface AuditLog {
  id: string
  action: AuditAction
  targetTable: string
  targetId: string
  reason: string | null
  ipAddress: string | null
  createdAt: Date
  actor: { name: string; employeeId: string } | null
  targetUser: { name: string; employeeId: string } | null
}

export function AuditLogTable({ logs }: { logs: AuditLog[] }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      {logs.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">No audit logs yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-left text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Actor</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Target</th>
                <th className="px-5 py-3.5">Reason</th>
                <th className="px-5 py-3.5">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="text-xs font-semibold text-slate-900">{timeAgo(log.createdAt)}</div>
                    <div className="text-[10px] text-slate-400">{formatDateTime(log.createdAt)}</div>
                  </td>
                  <td className="px-5 py-4">
                    {log.actor ? (
                      <>
                        <div className="font-medium text-slate-900">{log.actor.name}</div>
                        <div className="text-xs text-slate-500">{log.actor.employeeId}</div>
                      </>
                    ) : <span className="text-slate-400">System</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold', ACTION_COLORS[log.action] ?? 'text-slate-500 bg-slate-50 border-slate-200')}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    <div className="text-xs font-medium text-slate-900">{log.targetTable}</div>
                    {log.targetUser && <div className="text-xs text-slate-500">{log.targetUser.name}</div>}
                  </td>
                  <td className="px-5 py-4 text-slate-500 max-w-48 truncate">{log.reason ?? '—'}</td>
                  <td className="px-5 py-4 text-xs font-mono text-slate-400">{log.ipAddress ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
