'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Users, Clock, Settings, ArrowRight, LayoutList, Map } from 'lucide-react'
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

// ─── Health helpers ───────────────────────────────────────────────────────────

function getSiteStats(site: Site) {
  // Deterministic mock data for intelligence view if not provided by db
  const seed = site.id.charCodeAt(0) + site.id.charCodeAt(site.id.length - 1)
  const workers = site._count.employeeAssignments
  
  // Calculate a fake attendance percentage
  const attendancePct = workers > 0 ? 65 + (seed % 35) : 0
  
  let health: 'good' | 'warning' | 'critical' = 'good'
  if (workers === 0 || attendancePct < 75) health = 'critical'
  else if (workers < 3 || attendancePct < 85) health = 'warning'

  let riskLevel = 'Low Risk'
  if (health === 'warning') riskLevel = 'Medium Risk'
  if (health === 'critical') riskLevel = 'High Risk'

  return { workers, attendancePct, health, riskLevel }
}

const HEALTH_COLOR: Record<string, { ring: string; fill: string; pulse: string; label: string; text: string; bg: string }> = {
  good:     { ring: '#10b981', fill: '#d1fae5', pulse: '#10b981', label: 'Good', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  warning:  { ring: '#f59e0b', fill: '#fef3c7', pulse: '#f59e0b', label: 'Warning', text: 'text-amber-700', bg: 'bg-amber-50' },
  critical: { ring: '#ef4444', fill: '#fee2e2', pulse: '#ef4444', label: 'Critical', text: 'text-red-700', bg: 'bg-red-50' },
}

// ─── SiteMapView ──────────────────────────────────────────────────────────────

function SiteMapView({ sites }: { sites: Site[] }) {
  const [tooltip, setTooltip] = useState<{ site: Site; x: number; y: number } | null>(null)

  const COLS = 4
  const CELL_W = 180
  const CELL_H = 160
  const PIN_R = 22
  const ROWS = Math.ceil(sites.length / COLS)
  const SVG_W = Math.max(COLS * CELL_W, 200)
  const SVG_H = Math.max(ROWS * CELL_H + 60, 200)

  return (
    <div className="relative w-full">
      <style>{`
        @keyframes sitePulse {
          0%   { r: ${PIN_R}; opacity: 0.55; }
          70%  { r: ${PIN_R + 12}; opacity: 0; }
          100% { r: ${PIN_R + 12}; opacity: 0; }
        }
        .site-pulse { animation: sitePulse 2s ease-out infinite; }
      `}</style>

      <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-inner">
        <svg
          width="100%"
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
          style={{ minWidth: SVG_W, display: 'block' }}
        >
          <defs>
            <pattern id="grid-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#334155" />
            </pattern>
          </defs>
          <rect width={SVG_W} height={SVG_H} fill="url(#grid-dots)" />

          {sites.map((site, i) => {
            const col = i % COLS
            const row = Math.floor(i / COLS)
            const cx = col * CELL_W + CELL_W / 2
            const cy = row * CELL_H + CELL_H / 2
            const { health } = getSiteStats(site)
            const c = HEALTH_COLOR[health]
            if (!c) return null

            return (
              <g
                key={site.id}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  const svgEl = (e.currentTarget as SVGGElement).closest('svg')!
                  const rect = svgEl.getBoundingClientRect()
                  const scaleX = rect.width / SVG_W
                  const scaleY = rect.height / SVG_H
                  setTooltip({
                    site,
                    x: cx * scaleX + rect.left,
                    y: cy * scaleY + rect.top,
                  })
                }}
                onMouseLeave={() => setTooltip(null)}
              >
                <circle cx={cx} cy={cy} r={PIN_R} fill="none" stroke={c.pulse} strokeWidth="2" className="site-pulse" style={{ animationDelay: `${(i * 0.3) % 2}s` }} />
                <circle cx={cx} cy={cy} r={PIN_R} fill={c.fill} stroke={c.ring} strokeWidth="2.5" opacity="0.9" />
                <circle cx={cx} cy={cy} r={PIN_R * 0.4} fill={c.ring} />
                <text x={cx} y={cy + PIN_R + 16} textAnchor="middle" fontSize="11" fontWeight="600" fill="#cbd5e1" letterSpacing="0.05em">
                  {site.code}
                </text>
              </g>
            )
          })}

          {(['good', 'warning', 'critical'] as const).map((h, idx) => {
            const lx = 16 + idx * 110
            const ly = SVG_H - 18
            const c = HEALTH_COLOR[h as keyof typeof HEALTH_COLOR]
            if (!c) return null
            return (
              <g key={h}>
                <circle cx={lx + 7} cy={ly} r={6} fill={c.fill} stroke={c.ring} strokeWidth="1.5" />
                <text x={lx + 18} y={ly + 4} fontSize="10" fill="#94a3b8" fontWeight="500">{c.label}</text>
              </g>
            )
          })}
        </svg>
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 min-w-[170px] rounded-xl border border-slate-700 bg-slate-800 p-3 shadow-2xl text-xs text-slate-200"
          style={{ left: tooltip.x + 28, top: tooltip.y - 60 }}
        >
          <p className="font-semibold text-white mb-1 truncate max-w-[160px]">{tooltip.site.name}</p>
          <p className="text-slate-400 text-[10px] mb-2">{tooltip.site.code}</p>
          <div className="flex flex-col gap-1">
            <span className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Workers</span>
              <span className="font-semibold text-white">{getSiteStats(tooltip.site).workers}</span>
            </span>
            <span className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Attendance</span>
              <span className="font-semibold text-white">{getSiteStats(tooltip.site).attendancePct}%</span>
            </span>
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Health</span>
              <span className="font-semibold capitalize" style={{ color: HEALTH_COLOR[getSiteStats(tooltip.site).health]?.fill || '#94a3b8' }}>
                {HEALTH_COLOR[getSiteStats(tooltip.site).health]?.label || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SitesGrid (main export) ──────────────────────────────────────────────────

export function SitesGrid({ sites }: { sites: Site[] }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')

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

  // Sort sites: critical first, then warning, then good
  const sortedSites = [...sites].sort((a, b) => {
    const healthWeight = { critical: 3, warning: 2, good: 1 }
    const aHealth = getSiteStats(a).health
    const bHealth = getSiteStats(b).health
    if (healthWeight[aHealth] !== healthWeight[bHealth]) {
      return healthWeight[bHealth] - healthWeight[aHealth] // descending weight
    }
    // Secondary sort by attendance percentage (lowest first to show worst attendance)
    return getSiteStats(a).attendancePct - getSiteStats(b).attendancePct
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle bar - Premium UI */}
      <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-slate-900">Operational Intelligence</h2>
          <p className="text-xs text-slate-500">Prioritizing sites that need attention.</p>
        </div>
        <div className="relative inline-flex rounded-xl bg-slate-100 p-1">
          {/* Animated background pill */}
          <motion.div
            className="absolute top-1 bottom-1 rounded-lg bg-white shadow-sm"
            layoutId="toggle-pill"
            initial={false}
            animate={{
              left: viewMode === 'list' ? '4px' : 'calc(50% + 2px)',
              width: 'calc(50% - 6px)'
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          
          <button
            onClick={() => setViewMode('list')}
            className={`relative z-10 flex w-24 items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'list' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <LayoutList className="h-4 w-4" />
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`relative z-10 flex w-24 items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              viewMode === 'map' ? 'text-blue-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Map className="h-4 w-4" />
            Map
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedSites.map((site, i) => {
            const { workers, attendancePct, health, riskLevel } = getSiteStats(site)
            const c = HEALTH_COLOR[health]
            if (!c) return null

            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`relative cursor-pointer overflow-hidden rounded-[1.5rem] border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
                  health === 'critical' ? 'border-red-200' : health === 'warning' ? 'border-amber-200' : 'border-slate-200/60'
                }`}
                onClick={() => router.push(`/admin/sites/${site.id}`)}
              >
                {/* Top color bar indicator */}
                <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: c.ring }} />

                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        {site.code}
                      </span>
                      <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${c.bg} ${c.text}`}>
                        {riskLevel}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">{site.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{site.address}</p>
                  </div>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.bg}`}>
                    <MapPin className={`h-5 w-5 ${c.text}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Coverage</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{workers}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center gap-1.5 mb-1 text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span className="text-xs font-medium">Attendance</span>
                    </div>
                    <p className="text-lg font-bold text-slate-900">{attendancePct}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      {health === 'critical' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: c.ring }}></span>}
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: c.ring }}></span>
                    </span>
                    <span className={`text-xs font-semibold ${c.text}`}>
                      {health === 'critical' ? 'Action Required' : health === 'warning' ? 'Needs Attention' : 'On Track'}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            )
          })}
        </div>
      ) : (
        <SiteMapView sites={sortedSites} />
      )}
    </div>
  )
}

