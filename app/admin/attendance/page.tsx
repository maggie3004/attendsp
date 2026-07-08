import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { AttendanceSheet } from '@/components/admin/attendance/AttendanceSheet'
import { AttendanceCaptureDashboard } from '@/components/admin/AttendanceCaptureDashboard'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader } from '@/components/ui/DesignSystem'

export const metadata: Metadata = { title: 'Attendance' }

export default async function AttendancePage() {
  const [sites, employees] = await Promise.all([
    prisma.site.findMany({ where: { isActive: true }, select: { id: true, name: true, code: true } }),
    prisma.user.findMany({ where: { role: 'WORKER', isActive: true }, select: { id: true, name: true, employeeId: true }, orderBy: { name: 'asc' } }),
  ])

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Live monitoring"
          title="Attendance"
          description="Monitor field check-ins, attendance health, and recent activity from a single operations view."
        />

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AttendanceCaptureDashboard stats={{ total: employees.length, present: 0, offlineQueue: 0 }} />
          <AttendanceSheet sites={sites} />
        </div>
      </div>
    </PageShell>
  )
}
