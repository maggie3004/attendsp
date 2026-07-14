import { formatDateTime, timeAgo, cn } from '@/lib/utils'
import type { AuditAction } from '@prisma/client'

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  CREATE: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  UPDATE: 'text-amber-700 bg-amber-50 border-amber-200',
  DELETE: 'text-red-700 bg-red-50 border-red-200',
  ATTENDANCE_MARK: 'text-blue-700 bg-blue-50 border-blue-200',
  ATTENDANCE_OVERRIDE: 'text-cyan-700 bg-cyan-50 border-cyan-200',
  FACE_REGISTER: 'text-purple-700 bg-purple-50 border-purple-200',
  FACE_UPDATE: 'text-purple-700 bg-purple-50 border-purple-200',
  LEAVE_APPROVE: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  LEAVE_REJECT: 'text-red-700 bg-red-50 border-red-200',
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
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white py-12">
        <div className="text-slate-500 font-medium text-center">No audit logs found</div>
      </div>
    )
  }

  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="overflow-x-auto rounded-[1rem] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50 text-left text-[0.75rem] font-bold uppercase tracking-[0.24em] text-slate-500">
              <th className="px-5 py-3.5">Time</th>
              <th className="px-5 py-3.5">Actor</th>
              <th className="px-5 py-3.5">Action</th>
              <th className="px-5 py-3.5">Target</th>
              <th className="px-5 py-3.5">Reason</th>
              <th className="px-5 py-3.5">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-xs font-bold text-slate-900">{timeAgo(log.createdAt)}</div>
                  <div className="text-[10px] font-medium text-slate-500">{formatDateTime(log.createdAt)}</div>
                </td>
                <td className="px-5 py-4">
                  {log.actor ? (
                    <>
                      <div className="font-bold text-slate-900">{log.actor.name}</div>
                      <div className="text-[11px] font-medium text-slate-500">{log.actor.employeeId}</div>
                    </>
                  ) : <span className="text-slate-400 font-medium text-xs">System</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', ACTION_COLORS[log.action] ?? 'text-slate-500 bg-slate-50 border-slate-200')}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="text-xs font-bold text-slate-900">{log.targetTable}</div>
                  {log.targetUser && <div className="text-[11px] font-medium text-slate-500 mt-0.5">{log.targetUser.name}</div>}
                </td>
                <td className="px-5 py-4 text-xs text-slate-600 max-w-xs truncate">{log.reason ?? '—'}</td>
                <td className="px-5 py-4 text-xs font-mono text-slate-500">{log.ipAddress ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
