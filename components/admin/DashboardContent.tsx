'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Sparkline } from '@/components/ui/Sparkline'
import { Camera, FileText, MapPin, Plus, Users, Building2, Clock, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { RecentAttendance } from '@/components/admin/RecentAttendance'
import { SiteCoverageList } from '@/components/admin/SiteCoverageList'
import { AttendanceTrendChart } from '@/components/admin/charts/AttendanceTrendChart'
import type { ReactNode } from 'react'
import { PageShell } from '@/components/ui/Layout'

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
  }
}

const kpiSparklines = {
  total: [120, 122, 125, 128, 130, 131, 132],
  present: [85, 88, 90, 92, 95, 96, 98],
  sites: [4, 4, 4, 4, 4, 4, 4],
  leaves: [12, 10, 9, 11, 8, 9, 8],
}

function KpiCard({
  icon,
  iconTone,
  label,
  value,
  change,
  changeTone = 'text-emerald-600',
  sparkData,
  sparkColor,
}: {
  icon: ReactNode
  iconTone: string
  label: string
  value: number
  change: string
  changeTone?: string
  sparkData: number[]
  sparkColor: string
}) {
  return (
    <Card className="overflow-hidden bg-white rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-[146px] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
      <CardContent className="flex h-full flex-col p-6">
        <div className="mb-3 flex justify-between items-start">
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[1rem] ${iconTone}`}>
            {icon}
          </div>
        </div>
        <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-[2.5rem] font-bold tracking-tight text-slate-900 leading-none">{value}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-5">
          <p className={`text-[13px] font-bold ${changeTone}`}>{change}</p>
          <Sparkline data={sparkData} color={sparkColor} height={28} className="w-[80px]" />
        </div>
      </CardContent>
    </Card>
  )
}

export function DashboardContent({ firstName, coverage, data }: DashboardContentProps) {
  // Actions are now dynamically generated based on operational issues

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
      <PageShell className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
          {greeting}, {firstName} 👋
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Here's what's happening with your workforce today.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
      >
        <KpiCard
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconTone="bg-blue-100 rounded-full"
          label="Total Workers"
          value={data.totalEmployees}
          change="↑ 12 this week"
          sparkData={kpiSparklines.total}
          sparkColor="#2563EB"
        />
        <KpiCard
          icon={<ShieldCheck className="h-5 w-5 text-emerald-600" />}
          iconTone="bg-emerald-100 rounded-lg"
          label="Present Today"
          value={data.presentToday}
          change={`${coverage}% of total`}
          sparkData={kpiSparklines.present}
          sparkColor="#10B981"
        />
        <KpiCard
          icon={<Building2 className="h-5 w-5 text-purple-600" />}
          iconTone="bg-purple-100 rounded-full"
          label="Active Sites"
          value={data.activeSites}
          change="100% operational"
          changeTone="text-purple-600"
          sparkData={kpiSparklines.sites}
          sparkColor="#8B5CF6"
        />
        <KpiCard
          icon={<FileText className="h-5 w-5 text-orange-600" />}
          iconTone="bg-orange-100 rounded-full"
          label="Pending Leaves"
          value={data.pendingLeaves}
          change="Requires action"
          changeTone="text-orange-600"
          sparkData={kpiSparklines.leaves}
          sparkColor="#F97316"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 lg:grid-cols-[1.7fr_1fr]"
      >
        <Card className="bg-white rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-7">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Attendance Overview</h2>
                <p className="mt-1 text-[13px] text-slate-500">Attendance trend for the last 7 days</p>
              </div>
              <div className="flex items-center gap-4 text-[12px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-300 border border-dashed border-slate-400" />Scheduled</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />Present</span>
                <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" />Absent</span>
              </div>
            </div>
            <AttendanceTrendChart embedded />
          </CardContent>
        </Card>

        <Card className="bg-white rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-7">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Site Coverage</h2>
                <p className="mt-1 text-[13px] text-slate-500">Live attendance by site</p>
              </div>
              <Link href="/admin/sites" className="text-[13px] font-bold text-brand hover:text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
                View all
              </Link>
            </div>
            <SiteCoverageList sites={data.sites} />
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid gap-6 lg:grid-cols-[1.45fr_1fr]"
      >
        <Card className="bg-white rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <CardContent className="p-7">
            <div className="mb-6 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                <p className="mt-1 text-[13px] text-slate-500">Latest check-ins and updates</p>
              </div>
              <Link href="/admin/attendance" className="text-[13px] font-bold text-brand hover:text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg transition-colors">
                View all
              </Link>
            </div>
            {data.recentAttendance.length > 0 ? (
              <RecentAttendance records={data.recentAttendance} />
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-sm font-medium text-slate-500">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="bg-white rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <CardContent className="p-7">
              <div className="mb-5">
                <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/admin/attendance/mark" className="flex items-center gap-3 rounded-[1rem] border border-slate-100 p-3 hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand">
                    <Camera className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Mark Attendance</div>
                    <div className="text-[11px] font-medium text-slate-500">Capture check-in</div>
                  </div>
                </Link>
                <Link href="/admin/employees/new" className="flex items-center gap-3 rounded-[1rem] border border-slate-100 p-3 hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Register Worker</div>
                    <div className="text-[11px] font-medium text-slate-500">Add new workforce</div>
                  </div>
                </Link>
                <Link href="/admin/reports" className="flex items-center gap-3 rounded-[1rem] border border-slate-100 p-3 hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">View Reports</div>
                    <div className="text-[11px] font-medium text-slate-500">Analytics & insights</div>
                  </div>
                </Link>
                <Link href="/admin/sites" className="flex items-center gap-3 rounded-[1rem] border border-slate-100 p-3 hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">Manage Sites</div>
                    <div className="text-[11px] font-medium text-slate-500">Update site details</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="relative flex min-h-[88px] items-center gap-3 overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/90 to-white px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-foreground">All systems operational</p>
              <p className="text-xs text-foreground-muted">Everything is running smoothly.</p>
            </div>
            <ShieldCheck className="absolute right-4 top-1/2 h-12 w-12 -translate-y-1/2 text-blue-200/50" />
          </div>
        </div>
      </motion.div>
    </PageShell>
  )
}
