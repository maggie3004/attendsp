import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { EmployeeList } from '@/components/admin/employees/EmployeeList'

export const metadata: Metadata = { title: 'Employees' }

export default async function EmployeesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="text-sm text-foreground/50 mt-0.5">Manage your workforce and face registrations</p>
        </div>
        <a
          href="/admin/employees/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-brand text-white text-sm font-semibold shadow-glow hover:opacity-90 transition-opacity"
        >
          + Add Employee
        </a>
      </div>
      <EmployeeList />
    </div>
  )
}
