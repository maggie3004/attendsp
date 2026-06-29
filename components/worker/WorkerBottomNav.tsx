'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarCheck, History, PalmtreeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/worker/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/worker/history', label: 'History', icon: History },
  { href: '/worker/leave', label: 'Leave', icon: PalmtreeIcon },
]

export function WorkerBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 safe-bottom">
      <div className="glass border-t border-surface-border/50 px-2 py-2">
        <div className="flex items-center justify-around">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center gap-1 px-6 py-1.5 rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-brand'
                    : 'text-foreground/40 hover:text-foreground/70'
                )}
              >
                <Icon className={cn('w-5 h-5 transition-transform duration-200', isActive && 'scale-110')} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
