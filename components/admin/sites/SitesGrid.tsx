'use client'

import { motion } from 'framer-motion'
import { MapPin, Users, Clock, Settings } from 'lucide-react'
import Link from 'next/link'

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
  if (sites.length === 0) {
    return (
      <div className="card py-20 flex flex-col items-center gap-4 text-slate-400">
        <MapPin className="w-12 h-12" />
        <p className="font-medium text-sm">No sites configured yet</p>
        <Link href="/admin/sites/new" className="text-brand font-semibold hover:underline text-sm">Add your first site</Link>
      </div>
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
          className="card p-5 hover:border-brand/30 transition-all duration-200 cursor-pointer group"
          onClick={() => window.location.href = `/admin/sites/${site.id}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-2.5 rounded-xl bg-brand/10 group-hover:bg-brand/15 transition-colors">
              <MapPin className="w-5 h-5 text-brand" />
            </div>
            <span className="text-xs text-slate-500 font-semibold bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              {site.code}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 mb-1">{site.name}</h3>
          <p className="text-xs font-medium text-slate-500 mb-4 line-clamp-1">{site.address}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{site._count.employeeAssignments} workers</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-400">
                R
              </div>
              <span>±{site.radiusMeters}m</span>
            </div>
            {site.startTime && (
              <div className="flex items-center gap-1.5 text-slate-500 font-medium col-span-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{site.startTime} – {site.endTime}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-500">Active</span>
            </div>
            <Settings className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
