import { formatDateTime, timeAgo, cn } from '@/lib/utils'
import type { AuditAction } from '@prisma/client'

const ACTION_COLORS: Partial<Record<AuditAction, string>> = {
  CREATE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  UPDATE: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
  ATTENDANCE_MARK: 'text-brand bg-brand/10 border-brand/20',
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
    <div className="card overflow-hidden">
      {logs.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">No audit logs yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Target</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="text-xs font-medium">{timeAgo(log.createdAt)}</div>
                    <div className="text-[10px] text-gray-300">{formatDateTime(log.createdAt)}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    {log.actor ? (
                      <>
                        <div className="font-medium">{log.actor.name}</div>
                        <div className="text-xs text-gray-400">{log.actor.employeeId}</div>
                      </>
                    ) : <span className="text-gray-300">System</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', ACTION_COLORS[log.action] ?? 'text-gray-500 bg-gray-50 border-gray-200')}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">
                    <div className="text-xs">{log.targetTable}</div>
                    {log.targetUser && <div className="text-xs text-gray-400">{log.targetUser.name}</div>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 max-w-48 truncate">{log.reason ?? '—'}</td>
                  <td className="px-5 py-3.5 text-gray-300 text-xs font-mono">{log.ipAddress ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
