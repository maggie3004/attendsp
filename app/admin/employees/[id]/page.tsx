import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Pencil } from 'lucide-react'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, RoleBadge, SectionCard } from '@/components/ui/DesignSystem'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Employee' }

export default async function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: { employee: { include: { siteAssignments: { include: { site: true } } } } },
  })

  if (!user) {
    return (
      <PageShell>
        <div className="py-12 text-center text-sm text-foreground-muted">User not found</div>
      </PageShell>
    )
  }

  const sites = user.employee?.siteAssignments.map((s) => s.site.name).join(', ') || '—'

  return (
    <PageShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Workforce roster"
          title={user.name}
          description={user.employeeId}
          action={
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/employees">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
              <Link href={`/admin/employees/${user.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Link href={`/admin/employees/${user.id}/history`}>
                <Button variant="primary" size="sm">
                  <Calendar className="h-4 w-4" />
                  Attendance
                </Button>
              </Link>
            </div>
          }
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Profile" description="Contact and role information">
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Phone</dt>
                  <dd className="text-sm font-medium text-foreground">{user.phone ?? '—'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Email</dt>
                  <dd className="text-sm font-medium text-foreground">{user.email ?? '—'}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Assigned sites</dt>
                  <dd className="text-sm font-medium text-foreground">{sites}</dd>
                </div>
              </div>
            </dl>
          </SectionCard>

          <SectionCard title="Access" description="Role and account status">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-foreground-muted">Role</p>
                <div className="mt-1.5">
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground-muted">Status</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {user.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  )
}
