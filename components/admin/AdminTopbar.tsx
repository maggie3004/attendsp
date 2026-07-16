'use client'

import { signOut } from 'next-auth/react'
import { ShieldCheck, Bell, ChevronDown, LogOut, Search, Calendar } from 'lucide-react'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { UserRole } from '@prisma/client'
import { useSidebar } from './SidebarContext'

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
  const { collapsed } = useSidebar()

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="sticky top-0 z-20 flex h-[72px] flex-shrink-0 items-center gap-6 bg-white border-b border-slate-200 px-8 border-l-[6px] border-l-blue-600 transition-all duration-300">
      <div className="flex items-center gap-3 w-[256px] flex-shrink-0">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] bg-blue-600 text-white shadow-sm">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-[18px] font-bold tracking-tight text-slate-900 leading-tight">AttendSP</div>
          <div className="truncate text-[11px] font-medium text-slate-500 mt-0.5">Workforce Management</div>
        </div>
      </div>
      <div className="flex h-[44px] min-w-0 flex-1 max-w-xl items-center gap-3 rounded-full border border-slate-200 bg-white px-5 focus-within:border-slate-300 focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all shadow-sm">
        <Search className="h-[18px] w-[18px] flex-shrink-0 text-slate-400" />
        <input
          type="text"
          placeholder="Search employees, sites, attendance..."
          className="min-w-0 flex-1 bg-transparent text-[14px] text-slate-900 placeholder:text-slate-400 outline-none"
        />
        <kbd className="hidden flex-shrink-0 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-bold text-slate-500 lg:inline shadow-sm">
          ⌘K
        </kbd>
      </div>

      <div className="flex flex-shrink-0 items-center gap-6">
        <div className="hidden items-center gap-2 xl:flex">
          <Calendar className="h-[18px] w-[18px] text-slate-400" />
          <span className="whitespace-nowrap text-[13px] font-bold text-slate-500">{dateStr}</span>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex shadow-sm">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-dot" />
          <span className="text-[12px] font-bold text-emerald-700">Live sync active</span>
        </div>

        <button
          className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white ring-2 ring-white">
            3
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white pl-1.5 pr-3 transition hover:bg-slate-50 active:bg-slate-100 shadow-sm"
            aria-label="User menu"
          >
            {user.image ? (
              <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-[12px] font-bold text-white shadow-sm">
                {user.name?.charAt(0) ?? 'U'}
              </div>
            )}
            <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
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
                  className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
                >
                  <div className="border-b border-slate-100 p-4">
                    <p className="text-[14px] font-bold text-slate-900">{user.name}</p>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
