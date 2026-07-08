'use client'

import { Camera, MapPin, Zap, CircleCheckBig, ArrowRight } from 'lucide-react'
import { StatsCard, SectionCard, InfoCard } from '@/components/ui/DesignSystem'
import { Button } from '@/components/ui/Button'

export function AttendanceCaptureDashboard({ stats }: { stats: { total:number; present:number; offlineQueue:number } }){
  return (
    <div className="space-y-6">
      <SectionCard title="Attendance capture" description="Primary action area for the field team">
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Live capture station</p>
                <p className="mt-1 text-sm text-slate-500">Camera feed and sync controls for a fast field check-in experience.</p>
              </div>
              <div className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">Ready</div>
            </div>
            <div className="mt-5 flex min-h-[180px] items-center justify-center rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
              Camera feed placeholder
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button variant="primary" size="md">Capture Attendance</Button>
              <Button variant="outline" size="md">Sync Now</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard label="Workers" value={stats.total} icon={<Zap className="h-5 w-5 text-blue-600" />} accent="text-blue-600" tone="bg-blue-50" />
            <StatsCard label="Present" value={stats.present} icon={<CircleCheckBig className="h-5 w-5 text-emerald-600" />} accent="text-emerald-600" tone="bg-emerald-50" />
            <StatsCard label="Offline queue" value={stats.offlineQueue} icon={<MapPin className="h-5 w-5 text-amber-600" />} accent="text-amber-600" tone="bg-amber-50" />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Recent operations" description="At-a-glance monitoring">
        <div className="grid gap-3 sm:grid-cols-2">
          <InfoCard title="Present" description="Checked in today" value={stats.present} icon={<CircleCheckBig className="h-4 w-4 text-slate-400" />} />
          <InfoCard title="Pending sync" description="Needs upload" value={stats.offlineQueue} icon={<MapPin className="h-4 w-4 text-slate-400" />} />
        </div>
      </SectionCard>
    </div>
  )
}
