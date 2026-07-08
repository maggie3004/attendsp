'use client'

import {
  Users, UserCheck, Clock, Coffee, UserX, PlaneTakeoff, Briefcase,
} from 'lucide-react'
import { StatsCard } from '@/components/ui/DesignSystem'

interface DashboardStatsProps {
  data: {
    totalEmployees: number
    presentToday: number
    lateToday: number
    halfDayToday: number
    absentToday: number
    onLeave: number
    travelDuty: number
  }
}

export function DashboardStats({ data }: DashboardStatsProps) {
  const stats = [
    {
      label: 'Total Workers',
      value: data.totalEmployees,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      accent: 'text-blue-600',
      tone: 'bg-blue-50',
      change: '+2.4%',
      trend: 'up' as const,
    },
    {
      label: 'Present Today',
      value: data.presentToday,
      icon: <UserCheck className="h-5 w-5 text-emerald-600" />,
      accent: 'text-emerald-600',
      tone: 'bg-emerald-50',
      change: `${Math.round((data.presentToday / Math.max(data.totalEmployees, 1)) * 100)}%`,
      trend: 'up' as const,
    },
    {
      label: 'Late Arrivals',
      value: data.lateToday,
      icon: <Clock className="h-5 w-5 text-amber-600" />,
      accent: 'text-amber-600',
      tone: 'bg-amber-50',
      change: 'Needs review',
      trend: 'down' as const,
    },
    {
      label: 'Half Day',
      value: data.halfDayToday,
      icon: <Coffee className="h-5 w-5 text-orange-600" />,
      accent: 'text-orange-600',
      tone: 'bg-orange-50',
      change: 'Watchlist',
      trend: 'steady' as const,
    },
    {
      label: 'Absent',
      value: data.absentToday,
      icon: <UserX className="h-5 w-5 text-rose-600" />,
      accent: 'text-rose-600',
      tone: 'bg-rose-50',
      change: 'Action',
      trend: 'down' as const,
    },
    {
      label: 'On Leave',
      value: data.onLeave,
      icon: <Briefcase className="h-5 w-5 text-slate-600" />,
      accent: 'text-slate-700',
      tone: 'bg-slate-100',
      change: 'Planned',
      trend: 'steady' as const,
    },
    {
      label: 'Travel Duty',
      value: data.travelDuty,
      icon: <PlaneTakeoff className="h-5 w-5 text-violet-600" />,
      accent: 'text-violet-600',
      tone: 'bg-violet-50',
      change: 'Field',
      trend: 'steady' as const,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-[1.35rem] border border-slate-200 bg-white/95 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)]">
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  )
}
