import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { SidebarProvider } from '@/components/admin/SidebarContext'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  if (session.user.role === 'WORKER') redirect('/worker/attendance')

  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-dvh overflow-hidden bg-surface">
        <AdminTopbar user={session.user} />
        <div className="flex min-w-0 flex-1 overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 min-w-0 overflow-y-auto bg-slate-100">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
