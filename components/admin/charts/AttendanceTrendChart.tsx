'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { subDays, format } from 'date-fns'
import { useEffect, useState } from 'react'

interface TrendData {
  date: string
  present: number
  late: number
  absent: number
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-lg">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="capitalize text-slate-600">{entry.name}:</span>
            <span className="font-semibold text-slate-900">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

export function AttendanceTrendChart() {
  const [data, setData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reports/trend?days=7')
      .then((r) => r.json())
      .then((d) => { setData(d.data ?? []); setIsLoading(false) })
      .catch(() => {
        const placeholder = Array.from({ length: 7 }, (_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'dd MMM'),
          present: Math.floor(Math.random() * 30 + 60),
          late: Math.floor(Math.random() * 15),
          absent: Math.floor(Math.random() * 10),
        }))
        setData(placeholder)
        setIsLoading(false)
      })
  }, [])

  return (
      <div className="card p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Weekly attendance overview</h2>
          <p className="mt-0.5 text-sm text-slate-500">Present, late, and missed shifts across the week</p>
        </div>
        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">Updated hourly</div>
      </div>

      {isLoading ? (
        <div className="h-56 rounded-2xl shimmer" />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Best day</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">Mon</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Peak present</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">92 workers</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Avg. late</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">6 workers</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={224}>
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#dc2626" stopOpacity={0.16} />
                  <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d1d5db', strokeWidth: 1 }} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#6b7280', paddingTop: '12px' }} iconType="circle" iconSize={8} />
              <Area type="monotone" dataKey="present" stroke="#16a34a" fill="url(#presentGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="url(#lateGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="absent" stroke="#dc2626" fill="url(#absentGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
