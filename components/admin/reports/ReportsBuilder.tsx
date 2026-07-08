'use client'

import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { Download, FileSpreadsheet, FileText, Loader2, Search } from 'lucide-react'
import { formatTime, getStatusLabel, getStatusColor, cn } from '@/lib/utils'
import type { AttendanceStatus } from '@prisma/client'

interface ReportRow {
  date: string
  user: { name: string; employeeId: string }
  site: { name: string } | null
  checkInTime: string | null
  checkOutTime: string | null
  status: AttendanceStatus
  totalWorkMins: number | null
}

export function ReportsBuilder() {
  const [dateFrom, setDateFrom] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'))
  const [dateTo, setDateTo] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [data, setData] = useState<ReportRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState<'excel' | 'pdf' | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

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

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Filters</h2>
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

      {/* Results table */}
      {hasLoaded && (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80">
            <span className="text-sm font-semibold text-slate-600">{data.length} records</span>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 shimmer rounded-[1rem]" />
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">No records found for the selected period</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50 text-left text-[0.75rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    <th className="px-5 py-3.5">Date</th>
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Site</th>
                    <th className="px-5 py-3.5">Check In</th>
                    <th className="px-5 py-3.5">Check Out</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/80">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">{format(new Date(row.date), 'dd MMM yyyy')}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">{row.user.name}</div>
                        <div className="text-xs text-slate-500">{row.user.employeeId}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-500">{row.site?.name ?? '—'}</td>
                      <td className="px-5 py-4">{row.checkInTime ? formatTime(row.checkInTime) : '—'}</td>
                      <td className="px-5 py-4">{row.checkOutTime ? formatTime(row.checkOutTime) : '—'}</td>
                      <td className="px-5 py-4">
                        <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold', getStatusColor(row.status))}>
                          {getStatusLabel(row.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
