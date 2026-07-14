import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { User, Mail, Phone, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { RoleBadge } from '@/components/ui/DesignSystem'
import { WorkerProfileSignOut } from '@/components/worker/WorkerProfileSignOut'

export const metadata: Metadata = { title: 'My Profile' }

export default async function WorkerProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      employee: {
        include: {
          siteAssignments: {
            where: { isActive: true },
            include: { site: { select: { name: true } } },
          },
        },
      },
    },
  })

  if (!user) redirect('/login')

  const sites = user.employee?.siteAssignments.map((a) => a.site.name).join(', ') || '—'

  return (
    <div className="flex flex-col gap-7 px-5 pt-6 pb-10 animate-fade-in">
      <Card className="shadow-xl shadow-black/5 rounded-[2rem] border-none">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand/10">
            <User className="h-7 w-7 text-brand" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-bold text-slate-900 truncate">{user.name}</h1>
            <p className="mt-0.5 text-[13px] text-slate-500">{user.employeeId}</p>
            <div className="mt-2">
              <RoleBadge role={user.role} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md shadow-black/5 rounded-2xl">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-[15px] font-bold text-slate-900">Contact</h2>
          <dl className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
              <span className="text-sm text-foreground">{user.phone ?? '—'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-foreground-subtle flex-shrink-0" />
              <span className="text-sm text-foreground truncate">{user.email ?? '—'}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-foreground-subtle flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">{sites}</span>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md shadow-black/5 rounded-2xl">
        <CardContent className="p-6">
          <WorkerProfileSignOut />
        </CardContent>
      </Card>
    </div>
  )
}
