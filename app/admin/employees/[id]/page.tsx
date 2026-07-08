import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Employee' }

export default async function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user.findUnique({ where: { id: params.id }, include: { employee: { include: { siteAssignments: { include: { site: true } } } } } })
  if (!user) return <div className="p-6">User not found</div>

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">{user.name}</h1>
        <div className="text-sm text-slate-500 mb-4">{user.employeeId}</div>
        <div className="space-y-3 text-sm text-slate-600">
        <div><strong>Phone:</strong> {user.phone ?? '—'}</div>
        <div><strong>Email:</strong> {user.email ?? '—'}</div>
        <div><strong>Role:</strong> {user.role}</div>
        <div><strong>Sites:</strong> {user.employee?.siteAssignments.map(s=>s.site.name).join(', ')}</div>
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href={`/admin/employees/${user.id}/edit`} className="inline-flex items-center justify-center rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Edit</Link>
        <Link href={`/admin/employees/${user.id}/history`} className="inline-flex items-center justify-center rounded-[1rem] bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">Attendance</Link>
      </div>
      </div>
    </div>
  )
}
