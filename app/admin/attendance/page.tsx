import type { Metadata } from 'next'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader } from '@/components/ui/DesignSystem'
import { prisma } from '@/lib/db'
import { AttendanceTable } from '@/components/admin/attendance/AttendanceTable'
import { Card, CardContent } from '@/components/ui/Card'
import { Users, Clock, Building2 } from 'lucide-react'

export const metadata: Metadata = { title: 'Attendance' }

export default async function AttendancePage() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const records = await prisma.attendanceRecord.findMany({
    where: { date: { gte: today } },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      site: true
    }
  })
  
  const present = records.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length
  const late = records.filter(r => r.status === 'LATE').length
  
  return (
    <PageShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Workforce Tracking"
          title="Attendance Management"
          description="Monitor today's live attendance, review check-ins, and manage worker presence across all sites."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
             <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="h-12 w-12 rounded-[1rem] bg-blue-100 flex items-center justify-center text-blue-600 mb-6">
                  <Users className="h-6 w-6"/>
                </div>
                <div>
                  <div className="text-[13px] text-slate-500 font-bold uppercase tracking-wide">Total Records Today</div>
                  <div className="text-[2.5rem] leading-none font-bold text-slate-900 mt-2">{records.length}</div>
                </div>
             </CardContent>
          </Card>
          <Card className="rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
             <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="h-12 w-12 rounded-[1rem] bg-emerald-100 flex items-center justify-center text-emerald-600 mb-6">
                  <Building2 className="h-6 w-6"/>
                </div>
                <div>
                  <div className="text-[13px] text-slate-500 font-bold uppercase tracking-wide">Present</div>
                  <div className="text-[2.5rem] leading-none font-bold text-slate-900 mt-2">{present}</div>
                </div>
             </CardContent>
          </Card>
          <Card className="rounded-[1.5rem] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1">
             <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="h-12 w-12 rounded-[1rem] bg-amber-100 flex items-center justify-center text-amber-600 mb-6">
                  <Clock className="h-6 w-6"/>
                </div>
                <div>
                  <div className="text-[13px] text-slate-500 font-bold uppercase tracking-wide">Late Arrivals</div>
                  <div className="text-[2.5rem] leading-none font-bold text-slate-900 mt-2">{late}</div>
                </div>
             </CardContent>
          </Card>
        </div>

        <div className="rounded-[1.5rem] border border-slate-200/60 bg-white p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h2 className="text-base font-bold text-slate-900 mb-6">Today's Activity</h2>
          <AttendanceTable initialRecords={records} />
        </div>
      </div>
    </PageShell>
  )
}
