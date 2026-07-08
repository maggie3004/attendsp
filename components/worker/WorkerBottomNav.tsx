'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CalendarCheck, History, PalmtreeIcon } from 'lucide-react'
import { motion } from 'framer-motion'
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
      <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-3 shadow-2xl shadow-slate-900/5">
        <div className="flex items-center justify-around gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative flex flex-col items-center px-4 py-2.5 rounded-[1.2rem] transition-all duration-200 flex-1',
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                )}
              >
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <span className="text-[10px] font-semibold mt-1">{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-0 rounded-[1.2rem] bg-blue-50 -z-10"
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
