'use client'

import { signOut } from 'next-auth/react'
import { Bell, ChevronDown, LogOut, Search } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { UserRole } from '@prisma/client'

interface AdminTopbarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    employeeId: string
    role: UserRole
  }
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="flex h-[72px] flex-shrink-0 items-center gap-6 border-b border-slate-200/60 bg-white px-6 lg:px-8">
      <div className="flex h-10 min-w-0 flex-1 max-w-xl items-center gap-3 rounded-full border border-transparent bg-slate-100/70 px-4 focus-within:border-slate-300 focus-within:bg-white focus-within:shadow-sm transition-all">
        <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees, sites, attendance..."
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-500 outline-none"
        />
        <kbd className="hidden flex-shrink-0 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 lg:inline">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-shrink-0 items-center gap-5">
        <span className="hidden whitespace-nowrap text-sm font-medium text-foreground-muted xl:inline">{dateStr}</span>

        <div className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 sm:flex">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span className="text-[11px] font-medium text-emerald-700">Live sync active</span>
        </div>

        <button
          className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-surface-border bg-white text-foreground-muted transition hover:bg-surface hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 items-center gap-2.5 rounded-full border border-transparent bg-white pl-1.5 pr-2 transition hover:bg-slate-50 active:bg-slate-100"
            aria-label="User menu"
          >
            {user.image ? (
              <img src={user.image} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-[11px] font-semibold text-white">
                {user.name?.charAt(0) ?? 'U'}
              </div>
            )}
            <ChevronDown className="hidden h-4 w-4 text-foreground-subtle sm:block" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-surface-border bg-white shadow-card-hover"
                >
                  <div className="border-b border-surface-border p-3">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-foreground-muted">{user.email}</p>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-foreground-muted transition hover:bg-red-50 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
