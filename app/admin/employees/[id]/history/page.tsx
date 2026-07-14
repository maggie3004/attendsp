import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { AttendanceStatus } from '@prisma/client'
import { PageShell } from '@/components/ui/Layout'
import { EmptyState, PageHeader, SectionCard, StatusBadge } from '@/components/ui/DesignSystem'
import { Button } from '@/components/ui/Button'
import { getStatusLabel } from '@/lib/utils'

export const metadata: Metadata = { title: 'Employee History' }

function statusTone(status: AttendanceStatus): 'success' | 'warning' | 'danger' | 'info' | 'neutral' {
  if (status === 'PRESENT') return 'success'
  if (['LATE', 'HALF_DAY'].includes(status)) return 'warning'
  if (status === 'ABSENT') return 'danger'
  if (status === 'LEAVE') return 'info'
  return 'neutral'
}

export default async function EmployeeHistoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user, records] = await Promise.all([
    prisma.user.findUnique({ where: { id: id }, select: { name: true, employeeId: true } }),
    prisma.attendanceRecord.findMany({
      where: { userId: id },
      orderBy: { date: 'desc' },
      include: { site: { select: { name: true } } },
      take: 50,
    }),
  ])

  return (
    <PageShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Workforce roster"
          title="Attendance history"
          description={user ? `${user.name} · ${user.employeeId}` : 'Last 50 records'}
          action={
            <Link href={`/admin/employees/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to Profile
              </Button>
            </Link>
          }
        />

        <SectionCard title="Recent records" description="Chronological attendance log">
          {records.length === 0 ? (
            <EmptyState
              title="No attendance records"
              description="This worker has no check-in history yet."
            />
          ) : (
            <div className="space-y-3">
              {records.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-surface-border bg-surface px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {format(new Date(r.date), 'dd MMM yyyy')}
                    </p>
                    {r.site && (
                      <p className="mt-0.5 text-xs text-foreground-muted">{r.site.name}</p>
                    )}
                  </div>
                  <StatusBadge label={getStatusLabel(r.status)} tone={statusTone(r.status)} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </PageShell>
  )
}
