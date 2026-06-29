import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { WorkerHeader } from '@/components/worker/WorkerHeader'
import { WorkerBottomNav } from '@/components/worker/WorkerBottomNav'

export default async function WorkerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <WorkerHeader user={session.user} />
      <main className="flex-1 pb-20 safe-bottom">
        {children}
      </main>
      <WorkerBottomNav />
    </div>
  )
}
