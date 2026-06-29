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
      <div className="flex items-center gap-3 p-4 border-b border-surface-border">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2.5 bg-surface-elevated border border-surface-border rounded-xl text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
        <div className="text-sm text-foreground/40">{total} employees</div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-8 space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 shimmer rounded-xl" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-foreground/40">
          <Users className="w-10 h-10" />
          <p className="text-sm">No employees found</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="divide-y divide-surface-border md:hidden">
            {employees.map((emp) => (
              <Link key={emp.id} href={`/admin/employees/${emp.id}`} className="flex items-center gap-4 p-4 hover:bg-surface-elevated/50 transition-colors">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold flex-shrink-0">
                  {emp.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{emp.name}</div>
                  <div className="text-xs text-foreground/40">{emp.employeeId}</div>
                  {emp.employee?.siteAssignments[0] && (
                    <div className="text-xs text-foreground/30 mt-0.5">{emp.employee.siteAssignments[0].site.name}</div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <div className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', emp.faceRegisteredAt ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-foreground/40 bg-surface-border border-surface-border')}>
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
                <tr className="border-b border-surface-border text-left text-xs text-foreground/40 uppercase tracking-wider">
                  <th className="px-5 py-3 font-medium">Employee</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Sites</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Face</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {employees.map((emp, i) => (
                  <motion.tr
                    key={emp.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-surface-elevated/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/employees/${emp.id}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{emp.name}</div>
                          <div className="text-xs text-foreground/40">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-foreground/60">{emp.phone ?? emp.email ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      {emp.employee?.siteAssignments.slice(0, 2).map((s) => (
                        <span key={s.site.id} className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated border border-surface-border mr-1">{s.site.code}</span>
                      ))}
                      {(emp.employee?.siteAssignments.length ?? 0) > 2 && (
                        <span className="text-xs text-foreground/40">+{(emp.employee?.siteAssignments.length ?? 0) - 2}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs px-2 py-1 rounded-full bg-brand/10 text-brand border border-brand/20">{emp.role}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className={cn('flex items-center gap-1.5 text-xs', emp.faceRegisteredAt ? 'text-emerald-400' : 'text-foreground/30')}>
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
