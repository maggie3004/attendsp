import type { Metadata } from 'next'
import { ReportsBuilder } from '@/components/admin/reports/ReportsBuilder'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reports</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Generate and export attendance reports</p>
      </div>
      <ReportsBuilder />
    </div>
  )
}
