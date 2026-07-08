import type { Metadata } from 'next'
import { ReportsBuilder } from '@/components/admin/reports/ReportsBuilder'
import { ReportsPanel } from '@/components/admin/ReportsPanel'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">Generate and export attendance reports</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ReportsPanel />
        </div>
        <div className="lg:col-span-2">
          <ReportsBuilder />
        </div>
      </div>
    </div>
  )
}
