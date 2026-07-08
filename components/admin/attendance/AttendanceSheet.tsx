'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, subDays, addDays } from 'date-fns'
import { cn, getStatusColor, getStatusLabel, formatTime } from '@/lib/utils'
import type { AttendanceStatus } from '@prisma/client'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Form'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table'

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
}: {
  sites: { id: string; name: string; code: string }[]
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
    <Card>
      <CardHeader
        title="Attendance register"
        description="Track daily attendance and apply quick filters for field teams."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setDate(format(subDays(new Date(date), 1), 'yyyy-MM-dd'))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
            <Button variant="ghost" size="sm" onClick={() => setDate(format(addDays(new Date(date), 1), 'yyyy-MM-dd'))}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1.6fr_1fr_1fr_1fr_160px]">
          <div className="relative md:col-span-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="pl-11"
            />
          </div>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            {['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'LEAVE', 'TRAVEL_DUTY', 'MANUAL_OVERRIDE'].map((s) => (
              <option key={s} value={s}>{getStatusLabel(s as AttendanceStatus)}</option>
            ))}
          </Select>
          <Select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
            <option value="">All Sites</option>
            {sites.map((s) => <option key={s.id} value={s.code}>{s.name}</option>)}
          </Select>
          <div className="flex items-center text-sm text-slate-500 justify-end">{filteredRecords.length} records</div>
        </div>
      </CardContent>

      {/* Table */}
      {isLoading ? (
        <CardContent>
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-14 shimmer rounded-2xl" />
            ))}
          </div>
        </CardContent>
      ) : filteredRecords.length === 0 ? (
        <CardContent>
          <div className="py-16 text-center text-slate-500 text-sm">No attendance records for {format(new Date(date), 'dd MMM yyyy')}</div>
        </CardContent>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Employee</TableHeaderCell>
                <TableHeaderCell>Site</TableHeaderCell>
                <TableHeaderCell>Check In</TableHeaderCell>
                <TableHeaderCell>Check Out</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Flags</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </tr>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div className="font-medium text-slate-900">{record.user.name}</div>
                    <div className="text-xs text-slate-500">{record.user.employeeId}</div>
                  </TableCell>
                  <TableCell>{record.site?.name ?? '—'}</TableCell>
                  <TableCell>{record.checkInTime ? formatTime(record.checkInTime) : '—'}</TableCell>
                  <TableCell>{record.checkOutTime ? formatTime(record.checkOutTime) : '—'}</TableCell>
                  <TableCell>
                    <span className={cn('inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold', getStatusColor(record.status))}>
                      {getStatusLabel(record.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {record.isManualOverride && (
                        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-[10px] font-semibold text-cyan-600">Override</span>
                      )}
                      {record.isWrongSite && (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-[10px] font-semibold text-amber-600">Wrong Site</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setOverrideDialogId(record.id)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Card>
  )
}
