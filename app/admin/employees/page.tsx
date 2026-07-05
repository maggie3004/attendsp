import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { EmployeeList } from '@/components/admin/employees/EmployeeList'

export const metadata: Metadata = { title: 'Employees' }

export default async function EmployeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage your workforce and face registrations</p>
        </div>
        <a
          href="/admin/employees/new"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand hover:bg-brand-600 text-white text-sm font-bold shadow-sm transition-colors"
        >
          + Add Employee
        </a>
      </div>
      <EmployeeList />
    </div>
  )
}
