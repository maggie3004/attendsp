import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { AttendanceSheet } from '@/components/admin/attendance/AttendanceSheet'

export const metadata: Metadata = { title: 'Attendance' }

export default async function AttendancePage() {
  const [sites, employees] = await Promise.all([
    prisma.site.findMany({ where: { isActive: true }, select: { id: true, name: true, code: true } }),
    prisma.user.findMany({ where: { role: 'WORKER', isActive: true }, select: { id: true, name: true, employeeId: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Attendance</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">View and manage attendance records across all sites</p>
      </div>
      <AttendanceSheet sites={sites} employees={employees} />
    </div>
  )
}
