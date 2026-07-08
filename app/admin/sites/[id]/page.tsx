import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Site' }

export default async function SiteDetailPage({ params }: { params: { id: string } }) {
  const site = await prisma.site.findUnique({ where: { id: params.id } })
  if (!site) return <div className="p-6">Site not found</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{site.name}</h1>
      <div className="text-sm text-slate-500 mb-4">{site.code}</div>
      <div className="space-y-2">
        <div><strong>Address:</strong> {site.address}</div>
        <div><strong>Coordinates:</strong> {site.latitude}, {site.longitude}</div>
        <div><strong>Radius (m):</strong> {site.radiusMeters}</div>
      </div>
      <div className="mt-6">
        <Link href="/admin/sites" className="rounded-xl border px-3 py-2">Back to sites</Link>
      </div>
    </div>
  )
}
