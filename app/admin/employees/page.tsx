import type { Metadata } from 'next'
import { EmployeeList } from '@/components/admin/employees/EmployeeList'
import { PageShell } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/DesignSystem'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Employees' }

export default async function EmployeesPage() {
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Workforce roster"
          title="Employees"
          description="Manage workforce profiles, face registrations, and account status from one operational workspace."
          action={
            <Link href="/admin/employees/new">
              <Button variant="primary" size="md" className="shadow-lg shadow-brand/25 rounded-xl font-semibold px-5">+ Add Worker</Button>
            </Link>
          }
        />
        <EmployeeList />
      </div>
    </PageShell>
  )
}
