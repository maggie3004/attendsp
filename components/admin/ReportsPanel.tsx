'use client'

import React from 'react'
import { FileText, Download } from 'lucide-react'

export function ReportsPanel(){
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Reports</h3>
          <p className="text-sm text-slate-500">Generate attendance and export data</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-[1rem] border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">Export CSV</button>
          <button className="rounded-[1rem] bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition">Run Report</button>
        </div>
      </div>
      <div className="mt-6 text-sm text-slate-600">Quick reports:</div>
      <ul className="mt-3 space-y-2 text-sm">
        <li className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3">
          <span>Daily attendance</span>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">Run</button>
        </li>
        <li className="flex items-center justify-between rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3">
          <span>Site coverage</span>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">Run</button>
        </li>
      </ul>
    </div>
  )
}
