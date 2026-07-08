'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Camera, FileText, MapPin, Plus, Users, Building2, Clock, Zap } from 'lucide-react'
import Link from 'next/link'
import { RecentAttendance } from '@/components/admin/RecentAttendance'
import { SiteBreakdown } from '@/components/admin/SiteBreakdown'
import { AttendanceTrendChart } from '@/components/admin/charts/AttendanceTrendChart'

interface DashboardContentProps {
  firstName: string
  coverage: number
  data: {
    totalEmployees: number
    presentToday: number
    lateToday: number
    absentToday: number
    activeSites: number
    pendingLeaves: number
    sites: any[]
    recentAttendance: any[]
    statsByStatus: Record<string, number>
  }
}

export function DashboardContent({ firstName, coverage, data }: DashboardContentProps) {
  const actions = [
    { href: '/admin/attendance', label: 'Mark Attendance', icon: Camera },
    { href: '/admin/employees', label: 'Register Worker', icon: Plus },
    { href: '/admin/reports', label: 'View Reports', icon: FileText },
    { href: '/admin/sites', label: 'Manage Sites', icon: MapPin },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-[0.08em]">Operations</p>
          <h1 className="text-3xl font-bold text-slate-950 mt-1">Good morning, {firstName}</h1>
          <p className="text-sm text-slate-500 mt-1">Here's what's happening with your workforce today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-medium text-slate-700">Live sync active</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 2x2 */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Total Workers */}
        <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">↑ 12 this week</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Total Workers</p>
            <p className="text-3xl font-bold text-slate-950 mt-2">{data.totalEmployees}</p>
            <p className="text-xs text-slate-500 mt-3">74% of total</p>
          </CardContent>
        </Card>

        {/* Present Today */}
        <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">✓ On track</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Present Today</p>
            <p className="text-3xl font-bold text-slate-950 mt-2">{data.presentToday}</p>
            <p className="text-xs text-slate-500 mt-3">{coverage}% of total</p>
          </CardContent>
        </Card>

        {/* Active Sites */}
        <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Building2 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">Stable</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Active Sites</p>
            <p className="text-3xl font-bold text-slate-950 mt-2">{data.activeSites}</p>
            <p className="text-xs text-slate-500 mt-3">100% operational</p>
          </CardContent>
        </Card>

        {/* Pending Leaves */}
        <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Requires action</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Pending Leaves</p>
            <p className="text-3xl font-bold text-slate-950 mt-2">{data.pendingLeaves}</p>
            <p className="text-xs text-slate-500 mt-3">Awaiting review</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
        className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]"
      >
        {/* Left Column */}
        <div className="space-y-6">
          {/* Attendance Overview */}
          <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-950">Attendance Overview</h2>
                <p className="text-sm text-slate-500 mt-1">Attendance trend for the last 7 days</p>
              </div>
              <AttendanceTrendChart />
            </CardContent>
          </Card>

          {/* Site Coverage */}
          <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-950">Site Coverage</h2>
                <p className="text-sm text-slate-500 mt-1">Live attendance by site</p>
              </div>
              <SiteBreakdown sites={data.sites} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Recent Activity</h2>
                  <p className="text-sm text-slate-500 mt-1">Latest check-ins and updates</p>
                </div>
              </div>
              <RecentAttendance records={data.recentAttendance} />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-950 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                {actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center gap-3 p-4 rounded-[1.2rem] border border-slate-200 bg-slate-50 text-slate-900 transition hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 group"
                    >
                      <Icon className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{action.label}</p>
                      </div>
                      <Zap className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition" />
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="overflow-hidden rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Zap className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-950">All systems operational</p>
                  <p className="text-xs text-slate-500">Everything is running smoothly.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  )
}
