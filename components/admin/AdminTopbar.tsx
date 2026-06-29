'use client'

import { signOut } from 'next-auth/react'
import { Bell, LogOut, User, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { UserRole } from '@prisma/client'
import { cn } from '@/lib/utils'

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  SUPERVISOR: 'Supervisor',
  WORKER: 'Worker',
}

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'text-purple-400',
  ADMIN: 'text-brand',
  SUPERVISOR: 'text-amber-400',
  WORKER: 'text-emerald-400',
}

interface AdminTopbarProps {
  user: {
    name: string
    email: string
    image?: string
    employeeId: string
    role: UserRole
  }
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="h-16 flex-shrink-0 border-b border-surface-border bg-surface-card/80 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Left: Page title placeholder (overridden per-page) */}
      <div className="flex items-center gap-2 ml-10 lg:ml-0">
        <div className="text-sm text-foreground/40">
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-surface-elevated transition-colors text-foreground/50 hover:text-foreground">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-surface-elevated transition-colors"
          >
            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium leading-tight">{user.name}</div>
              <div className={cn('text-xs leading-tight', ROLE_COLORS[user.role])}>
                {ROLE_LABELS[user.role]}
              </div>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-foreground/40 transition-transform duration-200', menuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 card p-1.5 z-50 shadow-card-hover"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-3 py-2.5 border-b border-surface-border mb-1.5">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-foreground/40">{user.employeeId}</div>
                </div>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-foreground/60 hover:text-foreground hover:bg-surface-elevated transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
