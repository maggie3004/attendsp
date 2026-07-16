'use client'

import { useState, useMemo } from 'react'
import { format, subDays } from 'date-fns'
import { ChevronDown, ChevronUp, FileSpreadsheet, FileText, Loader2, Search } from 'lucide-react'
import {
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatTime, getStatusLabel, getStatusColor, cn } from '@/lib/utils'
import type { AttendanceStatus } from '@prisma/client'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'

interface ReportRow {
  date: string
  user: { name: string; employeeId: string }
  site: { name: string } | null
  checkInTime: string | null
  checkOutTime: string | null
  status: AttendanceStatus
  totalWorkMins: number | null
}

// ---------------------------------------------------------------------------
// Derived analytics helpers
// ---------------------------------------------------------------------------

function buildStatusBreakdown(data: ReportRow[]) {
  const counts: Record<string, number> = {}
  for (const row of data) {
    counts[row.status] = (counts[row.status] ?? 0) + 1
  }
  return Object.entries(counts).map(([status, count]) => ({
    status: getStatusLabel(status as AttendanceStatus),
    count,
  }))
}

function buildTrendData(data: ReportRow[]) {
  const byDate: Record<string, { present: number; absent: number }> = {}
  for (const row of data) {
    const label = format(new Date(row.date), 'dd MMM')
    if (!byDate[label]) byDate[label] = { present: 0, absent: 0 }
    if (row.status === 'PRESENT' || row.status === 'LATE') {
      byDate[label].present += 1
    } else if (row.status === 'ABSENT') {
      byDate[label].absent += 1
    }
  }
  return Object.entries(byDate)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }))
}

function buildSummaryStats(data: ReportRow[]) {
  const total = data.length
  const presentCount = data.filter((r) => r.status === 'PRESENT' || r.status === 'LATE').length
  const lateCount = data.filter((r) => r.status === 'LATE').length
  const presentRate = total > 0 ? ((presentCount / total) * 100).toFixed(1) : '0.0'
  const workMinsRows = data.filter((r) => r.totalWorkMins != null)
  const avgWorkMins =
    workMinsRows.length > 0
      ? Math.round(workMinsRows.reduce((s, r) => s + (r.totalWorkMins ?? 0), 0) / workMinsRows.length)
      : 0
  const avgWorkHours = `${Math.floor(avgWorkMins / 60)}h ${avgWorkMins % 60}m`
  return { total, presentRate, lateCount, avgWorkHours }
}

// Colour palette for the bar chart bars keyed by status label
const STATUS_COLORS: Record<string, string> = {
  Present: '#22c55e',
  Absent: '#ef4444',
  Late: '#f59e0b',
  'Half Day': '#8b5cf6',
  'On Leave': '#3b82f6',
}
const DEFAULT_BAR_COLOR = '#94a3b8'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ReportsBuilder() {
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'))
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [data, setData] = useState<ReportRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState<'excel' | 'pdf' | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(true)

  async function generateReport() {
    setIsLoading(true)
    setHasLoaded(true)
    try {
      const params = new URLSearchParams({ from: dateFrom, to: dateTo })
      const res = await fetch(`/api/attendance?${params}`)
      const json = await res.json()
      setData(json.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }

  async function exportExcel() {
    setIsExporting('excel')
    try {
      const { utils, writeFile } = await import('xlsx')
      const ws = utils.json_to_sheet(
        data.map((row) => ({
          Date: format(new Date(row.date), 'dd MMM yyyy'),
          'Employee ID': row.user.employeeId,
          Name: row.user.name,
          Site: row.site?.name ?? '—',
          'Check In': row.checkInTime ? formatTime(row.checkInTime) : '—',
          'Check Out': row.checkOutTime ? formatTime(row.checkOutTime) : '—',
          Status: getStatusLabel(row.status),
          'Work Hours': row.totalWorkMins ? `${Math.floor(row.totalWorkMins / 60)}h ${row.totalWorkMins % 60}m` : '—',
        }))
      )
      const wb = utils.book_new()
      utils.book_append_sheet(wb, ws, 'Attendance')
      writeFile(wb, `AttendSP_Report_${dateFrom}_${dateTo}.xlsx`)
    } finally {
      setIsExporting(null)
    }
  }

  async function exportPdf() {
    setIsExporting('pdf')
    try {
      const { default: jsPDF } = await import('jspdf')
      const { default: autoTable } = await import('jspdf-autotable')
      const doc = new jsPDF()
      doc.text(`AttendSP Report: ${dateFrom} to ${dateTo}`, 14, 15)
      autoTable(doc, {
        head: [['Date', 'ID', 'Name', 'Site', 'Check In', 'Check Out', 'Status']],
        body: data.map((row) => [
          format(new Date(row.date), 'dd MMM'),
          row.user.employeeId,
          row.user.name,
          row.site?.name ?? '—',
          row.checkInTime ? formatTime(row.checkInTime) : '—',
          row.checkOutTime ? formatTime(row.checkOutTime) : '—',
          getStatusLabel(row.status),
        ]),
        startY: 22,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [99, 102, 241] },
      })
      doc.save(`AttendSP_Report_${dateFrom}_${dateTo}.pdf`)
    } finally {
      setIsExporting(null)
    }
  }

  // Derived analytics — recomputed only when data changes
  const statusBreakdown = useMemo(() => buildStatusBreakdown(data), [data])
  const trendData = useMemo(() => buildTrendData(data), [data])
  const summaryStats = useMemo(() => buildSummaryStats(data), [data])

  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------ */}
      {/* Filter panel                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="rounded-[1.5rem] border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-lg font-semibold text-slate-900 mb-5">Report Filters</h2>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_1.2fr_auto]">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />
          </div>
          <div className="flex items-end justify-end gap-3">
            <button
              onClick={generateReport}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-[1rem] bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Generate
            </button>
          </div>
          {data.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 lg:col-span-3 justify-end">
              <button
                onClick={exportExcel}
                disabled={!!isExporting}
                className="inline-flex items-center gap-2 rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-50"
              >
                {isExporting === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                Excel
              </button>
              <button
                onClick={exportPdf}
                disabled={!!isExporting}
                className="inline-flex items-center gap-2 rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-50"
              >
                {isExporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Analytics Summary (shown only when data is available)               */}
      {/* ------------------------------------------------------------------ */}
      {hasLoaded && !isLoading && data.length > 0 && (
        <div className="rounded-[1.5rem] border border-slate-200/60 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          {/* Header / toggle */}
          <button
            onClick={() => setShowAnalytics((v) => !v)}
            className="flex w-full items-center justify-between px-6 py-4 border-b border-slate-200/80 text-left"
          >
            <span className="text-base font-semibold text-slate-900">Analytics Summary</span>
            {showAnalytics ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showAnalytics && (
            <div className="p-6 space-y-6">
              {/* ---------------------------------------------------------- */}
              {/* Summary stat boxes                                           */}
              {/* ---------------------------------------------------------- */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatBox label="Total Records" value={String(summaryStats.total)} color="text-slate-900" />
                <StatBox label="Present Rate" value={`${summaryStats.presentRate}%`} color="text-emerald-600" />
                <StatBox label="Late Count" value={String(summaryStats.lateCount)} color="text-amber-600" />
                <StatBox label="Avg Work Hours" value={summaryStats.avgWorkHours} color="text-blue-600" />
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Charts row                                                   */}
              {/* ---------------------------------------------------------- */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Status Breakdown Bar Chart */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Status Breakdown
                  </p>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={statusBreakdown} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="status"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '0.75rem',
                          border: '1px solid #e2e8f0',
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="count" name="Records" radius={[6, 6, 0, 0]}>
                        {statusBreakdown.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[entry.status] ?? DEFAULT_BAR_COLOR}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Attendance Trend Line Chart */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Attendance Trend
                  </p>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={trendData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        width={30}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '0.75rem',
                          border: '1px solid #e2e8f0',
                          fontSize: 12,
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="present"
                        name="Present"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#22c55e' }}
                        activeDot={{ r: 5 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="absent"
                        name="Absent"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#ef4444' }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Results table                                                        */}
      {/* ------------------------------------------------------------------ */}
      {hasLoaded && (
        <div className="rounded-[1.5rem] border border-slate-200/60 bg-white p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
            <span className="text-sm font-semibold text-slate-600">{data.length} records</span>
          </div>
          {isLoading ? (
            <SkeletonLoader rows={5} />
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No records found for the selected period</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6 bg-slate-50/50 rounded-b-[1.5rem]">
              {data.map((row, i) => (
                <div key={i} className="group flex flex-col rounded-[1.5rem] border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <div className="flex justify-between items-center mb-5">
                    <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', getStatusColor(row.status))}>
                      {getStatusLabel(row.status)}
                    </span>
                    <span className="text-[12px] font-bold text-slate-500">{format(new Date(row.date), 'dd MMM yyyy')}</span>
                  </div>
                  <div className="space-y-5">
                    <div>
                      <div className="text-[12px] font-medium text-slate-500 mb-0.5">Employee</div>
                      <div className="text-base font-bold text-slate-900">{row.user.name} <span className="text-slate-400 text-xs ml-1">({row.user.employeeId})</span></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Check In</div>
                        <div className="text-sm font-bold text-slate-900">{row.checkInTime ? formatTime(row.checkInTime) : '—'}</div>
                      </div>
                      <div>
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Check Out</div>
                        <div className="text-sm font-bold text-slate-900">{row.checkOutTime ? formatTime(row.checkOutTime) : '—'}</div>
                      </div>
                    </div>
                    {row.site && (
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Site</span>
                          <span className="text-[13px] font-bold text-slate-900">{row.site.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatBox sub-component
// ---------------------------------------------------------------------------

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-[1rem] border border-slate-200/60 bg-white shadow-sm px-5 py-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-1">{label}</p>
      <p className={cn('text-2xl font-bold tabular-nums', color)}>{value}</p>
    </div>
  )
}
