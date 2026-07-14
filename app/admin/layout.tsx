import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role === 'WORKER') redirect('/worker/attendance')

  return (
    <div className="flex min-h-dvh overflow-hidden bg-surface">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  )
}
