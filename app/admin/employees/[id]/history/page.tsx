import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'

export const metadata: Metadata = { title: 'Employee History' }

export default async function EmployeeHistoryPage({ params }: { params: { id: string } }) {
  const records = await prisma.attendanceRecord.findMany({ where: { userId: params.id }, orderBy: { date: 'desc' }, include: { site: { select: { name: true } } }, take: 50 })

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-bold mb-3 text-slate-900">Attendance history</h1>
        {records.length === 0 ? (
          <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">No records</div>
        ) : (
          <div className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="rounded-[1rem] border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">{format(new Date(r.date), 'dd MMM yyyy')}</div>
                <div className="text-xs text-slate-500">Status: {r.status} {r.site ? `• ${r.site.name}` : ''}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
