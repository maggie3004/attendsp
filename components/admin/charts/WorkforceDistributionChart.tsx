'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

export function WorkforceDistributionChart({ stats }: { stats: Record<string, number> }) {
  const data = [
    { name: 'Present', value: (stats['PRESENT'] || 0) + (stats['HALF_DAY'] || 0), color: '#10B981' },
    { name: 'Late', value: stats['LATE'] || 0, color: '#F59E0B' },
    { name: 'Absent', value: stats['ABSENT'] || 0, color: '#EF4444' },
    { name: 'Leave', value: stats['LEAVE'] || 0, color: '#8B5CF6' }
  ].filter(d => d.value > 0)

  if (data.length === 0) {
    return <div className="flex h-[260px] items-center justify-center text-sm font-medium text-slate-500">No data available</div>
  }

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={65}
            outerRadius={85}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', padding: '8px 12px' }}
            itemStyle={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#64748B' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
