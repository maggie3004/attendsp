'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Clock, Settings, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/Card'

interface Site {
  id: string
  name: string
  code: string
  address: string
  city: string | null
  radiusMeters: number
  startTime: string | null
  endTime: string | null
  _count: { employeeAssignments: number }
}

export function SitesGrid({ sites }: { sites: Site[] }) {
  const router = useRouter()
  if (sites.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="rounded-full bg-slate-100 p-3"><MapPin className="h-8 w-8 text-slate-400" /></div>
        <div>
          <p className="text-lg font-semibold text-slate-900">No sites configured yet</p>
          <p className="mt-1 text-sm text-slate-500">Create your first project site to start managing attendance and coverage.</p>
        </div>
        <Link href="/admin/sites/new" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">Add your first site <ArrowRight className="h-4 w-4" /></Link>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {sites.map((site, i) => (
        <motion.div
          key={site.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="cursor-pointer rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-blue-200 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)]"
          onClick={() => router.push(`/admin/sites/${site.id}`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="rounded-2xl bg-blue-50 p-2.5 transition-colors">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500">
              {site.code}
            </span>
          </div>

          <h3 className="mb-1 text-[1rem] font-semibold text-slate-900">{site.name}</h3>
          <p className="mb-4 line-clamp-1 text-sm text-slate-500">{site.address}</p>

          <div className="grid gap-3 text-sm text-slate-600">
            <div className="flex items-center justify-between rounded-[0.75rem] border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-slate-400" /><span>Workers</span></div>
              <span className="font-semibold text-slate-900">{site._count.employeeAssignments}</span>
            </div>
            <div className="flex items-center justify-between rounded-[0.75rem] border border-slate-200 bg-slate-50 px-3 py-2">
              <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" /><span>Hours</span></div>
              <span className="font-semibold text-slate-900">{site.startTime ? `${site.startTime} – ${site.endTime}` : 'Flexible'}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-sm font-semibold text-slate-600">Active</span>
            </div>
            <Settings className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
