'use client'

import { motion } from 'framer-motion'
import { Camera, MapPin, Users, Building2, ShieldCheck, ChevronRight, FileX, Clock, LineChart, TrendingUp, TrendingDown, Minus, Download, Plus, MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { RecentAttendance } from '@/components/admin/RecentAttendance'
import { SiteCoverageList } from '@/components/admin/SiteCoverageList'
import { AttendanceTrendChart } from '@/components/admin/charts/AttendanceTrendChart'

interface DashboardContentProps {
  firstName: string
  coverage: number
  data: {
    totalEmployees: number
    presentToday: number
    lateToday: number
    absentToday: number
    exceptionsToday: number
    sitesAtRisk: number
    operationalIssues: number
    activeSites: number
    pendingLeaves: number
    sites: any[]
    recentAttendance: any[]
    priorityAlerts: any[]
    statsByStatus: Record<string, number>
    changes: {
      total: string
    }
    trendData: any[]
  }
}

function StatCard({
  title,
  value,
  trend,
  trendValue,
  icon: Icon,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-50"
}: {
  title: string
  value: string | number
  trend: 'up' | 'down' | 'neutral'
  trendValue: string
  icon: any
  iconColor?: string
  iconBg?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${
          trend === 'up' ? 'text-emerald-700 bg-emerald-50' : 
          trend === 'down' ? 'text-red-700 bg-red-50' : 
          'text-slate-600 bg-slate-50'
        }`}>
          {trend === 'up' && <TrendingUp className="h-3.5 w-3.5" />}
          {trend === 'down' && <TrendingDown className="h-3.5 w-3.5" />}
          {trend === 'neutral' && <Minus className="h-3.5 w-3.5" />}
          <span>{trendValue}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  )
}

export function DashboardContent({ firstName, coverage, data }: DashboardContentProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium">
            Welcome back, {firstName}. Here is your workforce overview for today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4 text-slate-500" /> Export
          </button>
          <Link href="/admin/attendance/mark" className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
            <Camera className="h-4 w-4 text-slate-500" /> Mark Check-in
          </Link>
          <Link href="/admin/employees/new" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" /> Add Worker
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={data.totalEmployees}
          trend="up"
          trendValue="5% vs last week"
          icon={Users}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Present Today"
          value={data.presentToday}
          trend="neutral"
          trendValue={`${coverage}% coverage`}
          icon={ShieldCheck}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Active Sites"
          value={data.activeSites}
          trend="neutral"
          trendValue="All operational"
          icon={Building2}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
        />
        <StatCard
          title="Pending Leaves"
          value={data.pendingLeaves}
          trend="down"
          trendValue="Requires action"
          icon={Clock}
          iconColor="text-orange-600"
          iconBg="bg-orange-50"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (Chart & Activity) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Attendance Overview</h2>
                <p className="text-sm text-slate-500 mt-1">Workforce presence across all active sites.</p>
              </div>
              <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors">
                Last 7 days <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-600">
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-slate-300" />Scheduled</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" />Present</div>
                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" />Absent</div>
              </div>
              <div className="h-[300px] w-full -ml-4">
                <AttendanceTrendChart embedded initialData={data.trendData} />
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                <p className="text-sm text-slate-500 mt-1">Latest check-ins and system updates.</p>
              </div>
              <Link href="/admin/attendance" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                View all
              </Link>
            </div>
            <div className="p-0">
              {data.recentAttendance.length > 0 ? (
                <RecentAttendance records={data.recentAttendance} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <FileX className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">No recent activity</h3>
                  <p className="text-sm text-slate-500">Check-ins will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Site Coverage) */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="border-b border-slate-100 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Site Coverage</h2>
                <p className="text-sm text-slate-500 mt-1">Live attendance by location.</p>
              </div>
              <Link href="/admin/sites" className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors">
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="p-4">
              <SiteCoverageList sites={data.sites} />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
