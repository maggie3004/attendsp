import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { SitesGrid } from '@/components/admin/sites/SitesGrid'

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sites</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">{sites.length} active construction sites</p>
        </div>
        <a
          href="/admin/sites/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-600 text-white text-sm font-bold shadow-sm transition-colors"
        >
          + Add Site
        </a>
      </div>
      <SitesGrid sites={sites} />
    </div>
  )
}
