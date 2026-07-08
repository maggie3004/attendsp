import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { SitesGrid } from '@/components/admin/sites/SitesGrid'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, StatsCard } from '@/components/ui/DesignSystem'
import { Button } from '@/components/ui/Button'
import { Building2, Users, CircleCheckBig, MapPin } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sites' }

export default async function SitesPage() {
  const sites = await prisma.site.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { employeeAssignments: { where: { isActive: true } } } },
    },
  })

  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Project operations"
          title="Sites"
          description={`${sites.length} active construction sites are currently being managed.`}
          action={
            <Link href="/admin/sites/new">
              <Button variant="primary" size="md">+ Add Site</Button>
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard label="Active sites" value={sites.length} icon={<Building2 className="h-5 w-5 text-blue-600" />} accent="text-blue-600" tone="bg-blue-50" />
          <StatsCard label="Workers assigned" value={sites.reduce((sum, site) => sum + site._count.employeeAssignments, 0)} icon={<Users className="h-5 w-5 text-emerald-600" />} accent="text-emerald-600" tone="bg-emerald-50" />
          <StatsCard label="Attendance rate" value="82%" icon={<CircleCheckBig className="h-5 w-5 text-amber-600" />} accent="text-amber-600" tone="bg-amber-50" />
          <StatsCard label="Coverage" value="Stable" icon={<MapPin className="h-5 w-5 text-slate-600" />} accent="text-slate-600" tone="bg-slate-100" />
        </div>

        <SitesGrid sites={sites} />
      </div>
    </PageShell>
  )
}
