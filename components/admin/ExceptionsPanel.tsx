import { AlertCircle } from 'lucide-react'

export function ExceptionsPanel({ alerts }: { alerts: any[] }) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
        <div className="rounded-full bg-slate-50 p-3">
          <AlertCircle className="h-5 w-5 text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-500">No exceptions today</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100">
      {alerts.slice(0, 5).map((alert) => (
        <div key={alert.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
          <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${alert.status === 'ABSENT' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertCircle className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-slate-900">{alert.user.name}</p>
            <p className="truncate text-[11px] text-slate-500">
              {alert.status === 'ABSENT' ? 'Marked as absent' : `Late to ${alert.site?.name || 'site'}`}
            </p>
          </div>
          <div className="flex-shrink-0">
             <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${alert.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
               {alert.status}
             </span>
          </div>
        </div>
      ))}
    </div>
  )
}
