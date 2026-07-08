import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WorkerHeader } from '@/components/worker/WorkerHeader'
import { WorkerBottomNav } from '@/components/worker/WorkerBottomNav'

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <WorkerHeader user={session.user} />
      <main className="flex-1 pb-20 safe-bottom bg-slate-50">
        {children}
      </main>
      <WorkerBottomNav />
    </div>
  )
}
