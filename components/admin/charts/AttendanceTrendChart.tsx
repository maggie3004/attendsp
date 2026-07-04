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
      <div className="glass px-4 py-3 rounded-xl text-sm space-y-1">
        <div className="text-gray-500 text-xs mb-2">{label}</div>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-600 capitalize">{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
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
        // Generate placeholder data for demo
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
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-semibold text-gray-900">7-Day Attendance Trend</h2>
          <p className="text-xs text-gray-400 mt-0.5">Daily attendance overview</p>
        </div>
      </div>

      {isLoading ? (
        <div className="h-56 shimmer rounded-xl" />
      ) : (
        <ResponsiveContainer width="100%" height={224}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a30" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#2a2a30', strokeWidth: 1 }} />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '12px' }}
              iconType="circle"
              iconSize={8}
            />
            <Area type="monotone" dataKey="present" stroke="#10b981" fill="url(#presentGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="late" stroke="#f59e0b" fill="url(#lateGrad)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="absent" stroke="#ef4444" fill="url(#absentGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
