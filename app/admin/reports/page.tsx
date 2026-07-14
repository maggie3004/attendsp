import type { Metadata } from 'next'
import { ReportsBuilder } from '@/components/admin/reports/ReportsBuilder'
import { ReportsPanel } from '@/components/admin/ReportsPanel'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader } from '@/components/ui/DesignSystem'

export const metadata: Metadata = { title: 'Reports' }

export default function ReportsPage() {
  return (
    <PageShell>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Analytics"
          title="Reports"
          description="Generate and export attendance reports with custom date ranges and filters."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ReportsPanel />
          </div>
          <div className="lg:col-span-2">
            <ReportsBuilder />
          </div>
        </div>
      </div>
    </PageShell>
  )
}
