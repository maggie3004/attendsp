

import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WorkerHeader } from '@/components/worker/WorkerHeader'
import { WorkerSidebar } from '@/components/worker/WorkerSidebar'

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="flex min-h-dvh overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      <WorkerSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <WorkerHeader user={session.user} />
        <main className="flex-1 overflow-y-auto bg-slate-50 pb-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}
