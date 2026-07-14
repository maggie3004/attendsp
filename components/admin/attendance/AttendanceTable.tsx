'use client'

import { useState, useMemo } from 'react'
import { Search, Filter } from 'lucide-react'
import { cn, formatTime, getStatusLabel, getStatusColor } from '@/lib/utils'
import type { AttendanceStatus } from '@prisma/client'

interface AttendanceRecordProps {
  id: string
  status: AttendanceStatus
  checkInTime: Date | null
  checkOutTime: Date | null
  createdAt: Date
  user: { id: string; name: string; employeeId: string; profileImageUrl: string | null }
  site: { id: string; name: string; code: string } | null
}

export function AttendanceTable({ initialRecords }: { initialRecords: AttendanceRecordProps[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  const filteredRecords = useMemo(() => {
    return initialRecords.filter((record) => {
      const matchesSearch = 
        record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.site?.name.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus = statusFilter === 'ALL' || record.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [initialRecords, searchQuery, statusFilter])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID, or site..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 w-full rounded-[1rem] border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 appearance-none rounded-[1rem] border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 sm:w-[180px]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="ABSENT">Absent</option>
            <option value="LEAVE">On Leave</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="overflow-x-auto rounded-[1rem] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-left text-[0.75rem] font-bold uppercase tracking-[0.24em] text-slate-500">
                <th className="px-5 py-3.5">Employee</th>
                <th className="px-5 py-3.5">Site</th>
                <th className="px-5 py-3.5">Check In</th>
                <th className="px-5 py-3.5">Check Out</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {record.user.profileImageUrl ? (
                          <img src={record.user.profileImageUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                            {(record.user.name || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{record.user.name}</div>
                          <div className="text-[11px] font-medium text-slate-500">{record.user.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{record.site?.name ?? '—'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{record.checkInTime ? formatTime(record.checkInTime) : '—'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="text-xs font-bold text-slate-900">{record.checkOutTime ? formatTime(record.checkOutTime) : '—'}</div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide', getStatusColor(record.status))}>
                        {getStatusLabel(record.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
