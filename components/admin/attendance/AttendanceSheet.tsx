'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Filter, Download, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, subDays, addDays } from 'date-fns'
import { cn, getStatusColor, getStatusLabel, formatTime } from '@/lib/utils'
import type { AttendanceStatus } from '@prisma/client'

interface AttendanceRecord {
  id: string
  status: AttendanceStatus
  checkInTime: string | null
  checkOutTime: string | null
  isManualOverride: boolean
  isWrongSite: boolean
  flagReason: string | null
  user: { name: string; employeeId: string }
  site: { name: string; code: string } | null
}

export function AttendanceSheet({
  sites,
  employees,
}: {
  sites: { id: string; name: string; code: string }[]
  employees: { id: string; name: string; employeeId: string }[]
}) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [siteFilter, setSiteFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [overrideDialogId, setOverrideDialogId] = useState<string | null>(null)

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ from: date, to: date })
      const res = await fetch(`/api/attendance?${params}`)
      const data = await res.json()
      setRecords(data.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [date])

  useEffect(() => { fetchAttendance() }, [fetchAttendance])

  const filteredRecords = records.filter((r) => {
    const matchSearch = !search || r.user.name.toLowerCase().includes(search.toLowerCase()) || r.user.employeeId.includes(search)
    const matchStatus = !statusFilter || r.status === statusFilter
    const matchSite = !siteFilter || r.site?.code === siteFilter
    return matchSearch && matchStatus && matchSite
  })

  return (
    <div className="card overflow-hidden">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-4 border-b border-surface-border">
        {/* Date navigation */}
        <div className="flex items-center gap-1 bg-surface-elevated rounded-xl border border-surface-border">
          <button
            onClick={() => setDate(format(subDays(new Date(date), 1), 'yyyy-MM-dd'))}
            className="p-2 hover:bg-surface-hover rounded-l-xl transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent text-sm px-2 py-1.5 text-foreground focus:outline-none w-36"
          />
          <button
            onClick={() => setDate(format(addDays(new Date(date), 1), 'yyyy-MM-dd'))}
            className="p-2 hover:bg-surface-hover rounded-r-xl transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-elevated border border-surface-border rounded-xl text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-brand/50"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand/50"
        >
          <option value="">All Status</option>
          {['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'LEAVE', 'TRAVEL_DUTY', 'MANUAL_OVERRIDE'].map((s) => (
            <option key={s} value={s}>{getStatusLabel(s as AttendanceStatus)}</option>
          ))}
        </select>

        {/* Site filter */}
        <select
          value={siteFilter}
          onChange={(e) => setSiteFilter(e.target.value)}
          className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand/50"
        >
          <option value="">All Sites</option>
          {sites.map((s) => <option key={s.id} value={s.code}>{s.name}</option>)}
        </select>

        <div className="text-xs text-foreground/40 ml-auto">{filteredRecords.length} records</div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-6 space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-14 shimmer rounded-xl" />)}
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="py-16 text-center text-foreground/40 text-sm">
          No attendance records for {format(new Date(date), 'dd MMM yyyy')}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border text-left text-xs text-foreground/40 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Employee</th>
                <th className="px-5 py-3 font-medium">Site</th>
                <th className="px-5 py-3 font-medium">Check In</th>
                <th className="px-5 py-3 font-medium">Check Out</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Flags</th>
                <th className="px-5 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-surface-elevated/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium">{record.user.name}</div>
                    <div className="text-xs text-foreground/40">{record.user.employeeId}</div>
                  </td>
                  <td className="px-5 py-3.5 text-foreground/60">{record.site?.name ?? '—'}</td>
                  <td className="px-5 py-3.5">{record.checkInTime ? formatTime(record.checkInTime) : '—'}</td>
                  <td className="px-5 py-3.5">{record.checkOutTime ? formatTime(record.checkOutTime) : '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', getStatusColor(record.status))}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      {record.isManualOverride && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">Override</span>
                      )}
                      {record.isWrongSite && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">Wrong Site</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => setOverrideDialogId(record.id)}
                      className="text-xs text-brand hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
