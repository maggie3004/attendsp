'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarCheck, History, PalmtreeIcon, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/worker', label: 'Home', icon: Home },
  { href: '/worker/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/worker/history', label: 'History', icon: History },
  { href: '/worker/leave', label: 'Leave', icon: PalmtreeIcon },
  { href: '/worker/profile', label: 'Profile', icon: User },
]

export function WorkerBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white safe-bottom border-t border-slate-200">
      <div className="px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href === '/worker' ? pathname === '/worker' : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-colors min-w-[60px]',
                  isActive ? 'text-brand bg-brand/10' : 'text-slate-500 hover:text-slate-700'
                )}
              >
                <Icon className={cn('h-5 w-5', isActive ? 'stroke-[2.5] text-brand' : '')} />
                <span className={cn('text-[11px] font-medium', isActive && 'font-semibold')}>{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
