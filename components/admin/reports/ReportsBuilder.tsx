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
      {/* Filter panel */}
      <div className="card p-5">
        <h2 className="font-semibold mb-4">Report Filters</h2>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-brand/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-brand/50"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl gradient-brand text-white text-sm font-medium shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              Generate
            </button>
          </div>
          {data.length > 0 && (
            <>
              <div className="flex items-end">
                <button
                  onClick={exportExcel}
                  disabled={!!isExporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  {isExporting === 'excel' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileSpreadsheet className="w-4 h-4" />}
                  Excel
                </button>
              </div>
              <div className="flex items-end">
                <button
                  onClick={exportPdf}
                  disabled={!!isExporting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  {isExporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                  PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Results table */}
      {hasLoaded && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
            <span className="text-sm text-gray-500">{data.length} records</span>
          </div>
          {isLoading ? (
            <div className="p-6 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-12 shimmer rounded-xl" />)}</div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No records found for the selected period</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Employee</th>
                    <th className="px-5 py-3 font-medium">Site</th>
                    <th className="px-5 py-3 font-medium">Check In</th>
                    <th className="px-5 py-3 font-medium">Check Out</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">{format(new Date(row.date), 'dd MMM yyyy')}</td>
                      <td className="px-5 py-3">
                        <div className="font-medium">{row.user.name}</div>
                        <div className="text-xs text-gray-400">{row.user.employeeId}</div>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{row.site?.name ?? '—'}</td>
                      <td className="px-5 py-3">{row.checkInTime ? formatTime(row.checkInTime) : '—'}</td>
                      <td className="px-5 py-3">{row.checkOutTime ? formatTime(row.checkOutTime) : '—'}</td>
                      <td className="px-5 py-3">
                        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium border', getStatusColor(row.status))}>
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
