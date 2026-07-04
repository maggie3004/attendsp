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
      <div className="card py-20 flex flex-col items-center gap-4 text-gray-400">
        <MapPin className="w-12 h-12" />
        <p>No sites configured yet</p>
        <Link href="/admin/sites/new" className="text-brand hover:underline text-sm">Add your first site</Link>
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
            <span className="text-xs text-gray-300 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200">
              {site.code}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-1">{site.name}</h3>
          <p className="text-xs text-gray-400 mb-4 line-clamp-1">{site.address}</p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span>{site._count.employeeAssignments} workers</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400">
              <div className="w-3.5 h-3.5 rounded-full border border-foreground/20 flex items-center justify-center text-[8px]">
                R
              </div>
              <span>±{site.radiusMeters}m</span>
            </div>
            {site.startTime && (
              <div className="flex items-center gap-1.5 text-gray-400 col-span-2">
                <Clock className="w-3.5 h-3.5" />
                <span>{site.startTime} – {site.endTime}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-gray-400">Active</span>
            </div>
            <Settings className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-400 transition-colors" />
          </div>
        </motion.div>
      ))}
    </div>
  )
}
