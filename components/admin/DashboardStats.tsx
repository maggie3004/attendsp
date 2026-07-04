'use client'

import { motion } from 'framer-motion'
import {
  Users, UserCheck, Clock, Coffee, UserX, PlaneTakeoff, Briefcase
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number
  total?: number
  icon: React.ElementType
  color: string
  bgColor: string
  index: number
}

function StatCard({ label, value, total, icon: Icon, color, bgColor, index }: StatCardProps) {
  const percentage = total ? Math.round((value / total) * 100) : null
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: 'easeOut' }}
      className="card p-4 hover:shadow-sm transition-shadow duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-xl', bgColor)}>
          <Icon className={cn('w-4 h-4', color)} />
        </div>
        {percentage !== null && (
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', bgColor, color)}>
            {percentage}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-800 tabular-nums">{value}</div>
      <div className="text-xs text-gray-400 mt-0.5">{label}</div>
      {/* Progress bar */}
      {percentage !== null && (
        <div className="mt-3 h-1 bg-gray-50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.6, ease: 'easeOut' }}
            className={cn('h-full rounded-full', color.replace('text-', 'bg-'))}
          />
        </div>
      )}
    </motion.div>
  )
}

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
      label: 'Total Employees',
      value: data.totalEmployees,
      icon: Users,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Present Today',
      value: data.presentToday,
      total: data.totalEmployees,
      icon: UserCheck,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Late Arrivals',
      value: data.lateToday,
      total: data.totalEmployees,
      icon: Clock,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Half Day',
      value: data.halfDayToday,
      total: data.totalEmployees,
      icon: Coffee,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Absent',
      value: data.absentToday,
      total: data.totalEmployees,
      icon: UserX,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      label: 'On Leave',
      value: data.onLeave,
      total: data.totalEmployees,
      icon: Briefcase,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Travel Duty',
      value: data.travelDuty,
      total: data.totalEmployees,
      icon: PlaneTakeoff,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}
