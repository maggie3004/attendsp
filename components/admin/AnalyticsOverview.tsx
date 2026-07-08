'use client'

import React from 'react'
import { StatsCard } from '@/components/ui/DesignSystem'
import { Users, BarChart3, AlertTriangle } from 'lucide-react'

export function AnalyticsOverview({ data }: { data: any }){
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard label="Weekly Average" value={Math.round((data.presentAvg || 0))} icon={<BarChart3 className="h-5 w-5 text-blue-600" />} accent="text-blue-600" tone="bg-blue-50" />
        <StatsCard label="Active Sites" value={data.activeSites || 0} icon={<Users className="h-5 w-5 text-emerald-600" />} accent="text-emerald-600" tone="bg-emerald-50" />
        <StatsCard label="Alerts" value={data.alerts || 0} icon={<AlertTriangle className="h-5 w-5 text-rose-600" />} accent="text-rose-600" tone="bg-rose-50" />
      </div>
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
        <div className="text-sm text-slate-500">Attendance trend</div>
        <div className="mt-3 flex h-36 items-center justify-center rounded-[1.25rem] border border-slate-200/80 bg-slate-50 text-sm text-slate-400">
          Chart placeholder
        </div>
      </div>
    </div>
  )
}
