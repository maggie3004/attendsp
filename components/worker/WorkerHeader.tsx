'use client'

import { Bell, Menu, ArrowLeft } from 'lucide-react'
import type { UserRole } from '@prisma/client'
import { format } from 'date-fns'
import { usePathname, useRouter } from 'next/navigation'

interface WorkerHeaderProps {
  user: {
    name?: string | null
    employeeId: string
    role: UserRole
  }
}

export function WorkerHeader({ user }: WorkerHeaderProps) {
  const today = format(new Date(), 'EEEE, d MMMM yyyy')
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning,' : hour < 17 ? 'Good afternoon,' : 'Good evening,'

  const pathname = usePathname()
  const isHome = pathname === '/worker'

  const getPageTitle = () => {
    if (pathname.includes('/history')) return 'My Attendance'
    if (pathname.includes('/leave')) return 'Leave Requests'
    if (pathname.includes('/profile')) return 'My Profile'
    if (pathname.includes('/attendance')) return 'Secure Check-in'
    return ''
  }

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-br from-brand-700 to-brand-800 py-4 shadow-md safe-top">
      <div className="flex items-center gap-3 px-5">
        <button
          onClick={() => window.dispatchEvent(new Event('toggleWorkerSidebar'))}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20 lg:hidden"
          aria-label="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-white/80 uppercase tracking-wider">{today}</p>
          <h1 className="text-[17px] font-bold leading-tight tracking-tight text-white truncate">
            {isHome ? `${greeting} ${user.name?.split(' ')[0]} 👋` : getPageTitle()}
          </h1>
        </div>

        <button
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}
