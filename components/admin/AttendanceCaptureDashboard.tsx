'use client'

import { Camera, MapPin, CircleCheckBig, Wifi, Users, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ReactNode } from 'react'

function SummaryCard({
  label,
  value,
  icon,
  tone,
  sub,
}: {
  label: string
  value: number
  icon: ReactNode
  tone: string
  sub: string
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-surface-border/60 shadow-sm">
      <CardContent className="flex h-full flex-col p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full ${tone} text-white`}>
            {icon}
          </div>
          <div>
            <p className="text-[13px] font-medium text-foreground-muted">{label}</p>
            <p className="mt-0.5 text-[28px] font-bold leading-none tracking-tight text-foreground">{value}</p>
          </div>
        </div>
        <p className="mt-auto pt-2 text-[12px] font-medium text-foreground-muted">{sub}</p>
      </CardContent>
    </Card>
  )
}

export function AttendanceCaptureDashboard({ stats }: { stats: { total: number; present: number; absent: number; offlineQueue: number } }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Present" value={stats.present} icon={<CircleCheckBig className="h-[20px] w-[20px]" />} tone="bg-emerald-500" sub="Checked in today" />
        <SummaryCard label="Absent" value={stats.absent} icon={<Users className="h-[20px] w-[20px]" />} tone="bg-red-500" sub="Not checked in" />
        <SummaryCard label="Late" value={0} icon={<Clock className="h-[20px] w-[20px]" />} tone="bg-amber-500" sub="After threshold" />
        <SummaryCard label="Offline Queue" value={stats.offlineQueue} icon={<Wifi className="h-[20px] w-[20px]" />} tone="bg-slate-500" sub="Pending sync" />
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4">
            <h3 className="text-[15px] font-bold text-foreground">Attendance Capture</h3>
            <p className="mt-0.5 text-xs text-foreground-muted">Primary action area for the field team</p>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-surface-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Live capture station</p>
                <p className="mt-0.5 text-xs text-foreground-muted">Camera feed and sync controls for field check-in.</p>
              </div>
              <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">Ready</span>
            </div>

            <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-surface-border bg-surface text-sm text-foreground-subtle">
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8 text-foreground-subtle" />
                Camera feed placeholder
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button variant="primary" size="md">
                <Camera className="h-4 w-4" />
                Capture Attendance
              </Button>
              <Button variant="outline" size="md">
                <MapPin className="h-4 w-4" />
                Sync Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
