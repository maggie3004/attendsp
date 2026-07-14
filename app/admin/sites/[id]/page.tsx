import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, Navigation, Ruler } from 'lucide-react'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, SectionCard } from '@/components/ui/DesignSystem'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Site' }

export default async function SiteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const site = await prisma.site.findUnique({ where: { id: id } })

  if (!site) {
    return (
      <PageShell>
        <div className="py-12 text-center text-sm text-foreground-muted">Site not found</div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Site management"
          title={site.name}
          description={site.code}
          action={
            <Link href="/admin/sites">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back to sites
              </Button>
            </Link>
          }
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Location" description="Address and coordinates">
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Address</dt>
                  <dd className="text-sm font-medium text-foreground">{site.address}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Navigation className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Coordinates</dt>
                  <dd className="text-sm font-medium text-foreground">{site.latitude}, {site.longitude}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Ruler className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Geofence radius</dt>
                  <dd className="text-sm font-medium text-foreground">{site.radiusMeters} meters</dd>
                </div>
              </div>
            </dl>
          </SectionCard>

          <SectionCard title="Schedule" description="Working hours and thresholds">
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-foreground-subtle" />
                <div>
                  <dt className="text-xs font-medium text-foreground-muted">Working hours</dt>
                  <dd className="text-sm font-medium text-foreground">{site.startTime} – {site.endTime}</dd>
                </div>
              </div>
              <div>
                <dt className="text-xs font-medium text-foreground-muted">Late threshold</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">{site.lateThresholdMins} minutes</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-foreground-muted">Status</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {site.isActive ? 'Active' : 'Inactive'}
                </dd>
              </div>
            </dl>
          </SectionCard>
        </div>
      </div>
    </PageShell>
  )
}
