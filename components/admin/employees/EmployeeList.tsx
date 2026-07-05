'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Users, CheckCircle2, UserX } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn, getStatusColor } from '@/lib/utils'
import Link from 'next/link'

interface Employee {
  id: string
  employeeId: string
  name: string
  phone: string | null
  email: string | null
  role: string
  isActive: boolean
  designation: string | null
  department: string | null
  profileImageUrl: string | null
  faceRegisteredAt: string | null
  employee: {
    siteAssignments: { site: { id: string; name: string; code: string }; isPrimary: boolean }[]
  } | null
}

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search, page: String(page), pageSize: '20' })
      const res = await fetch(`/api/employees?${params}`)
      const data = await res.json()
      setEmployees(data.data ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setIsLoading(false)
    }
  }, [search, page])

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300)
    return () => clearTimeout(timer)
  }, [fetchEmployees])

  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
        <div className="text-sm font-medium text-slate-500">{total} employees</div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-8 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 shimmer rounded-xl" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
          <Users className="w-10 h-10" />
          <p className="text-sm">No employees found</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="divide-y divide-gray-200 md:hidden">
            {employees.map((emp) => (
              <Link key={emp.id} href={`/admin/employees/${emp.id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{emp.name}</div>
                  <div className="text-xs text-gray-400">{emp.employeeId}</div>
                  {emp.employee?.siteAssignments[0] && (
                    <div className="text-xs text-gray-300 mt-0.5">{emp.employee.siteAssignments[0].site.name}</div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', emp.faceRegisteredAt ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-400 bg-gray-100 border-gray-200')}>
                    {emp.faceRegisteredAt ? 'Face ✓' : 'No Face'}
                  </div>
                  <div className={cn('w-1.5 h-1.5 rounded-full', emp.isActive ? 'bg-emerald-400' : 'bg-red-400')} />
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs text-slate-500 font-bold uppercase tracking-wider bg-slate-50/50">
                  <th className="px-5 py-4">Employee</th>
                  <th className="px-5 py-4">Contact</th>
                  <th className="px-5 py-4">Sites</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Face</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/employees/${emp.id}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{emp.name}</div>
                          <div className="text-xs font-medium text-slate-500">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{emp.phone ?? emp.email ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      {emp.employee?.siteAssignments.slice(0, 2).map((s) => (
                        <span key={s.site.id} className="text-xs px-2 py-0.5 rounded-full bg-gray-50 border border-gray-200 mr-1">{s.site.code}</span>
                      ))}
                      {(emp.employee?.siteAssignments.length ?? 0) > 2 && (
                        <span className="text-xs text-gray-400">+{(emp.employee?.siteAssignments.length ?? 0) - 2}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">{emp.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={cn('flex items-center gap-1.5 text-xs', emp.faceRegisteredAt ? 'text-emerald-400' : 'text-gray-300')}>
                        <div className={cn('w-1.5 h-1.5 rounded-full', emp.faceRegisteredAt ? 'bg-emerald-400' : 'bg-foreground/20')} />
                        {emp.faceRegisteredAt ? 'Registered' : 'Not set'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={cn('flex items-center gap-1.5 text-xs', emp.isActive ? 'text-emerald-400' : 'text-red-400')}>
                        <div className={cn('w-1.5 h-1.5 rounded-full', emp.isActive ? 'bg-emerald-400' : 'bg-red-400')} />
                        {emp.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
