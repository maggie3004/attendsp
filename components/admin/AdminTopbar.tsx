'use client'

import { signOut } from 'next-auth/react'
import { Bell, LogOut, Search, ChevronDown } from 'lucide-react'
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
    <header className="flex h-16 flex-shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-4 md:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="hidden flex-1 max-w-md items-center gap-3 rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search employees, sites, attendance..."
          className="flex-1 bg-transparent text-sm placeholder-slate-400 outline-none"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Date & Live Indicator */}
        <div className="hidden sm:flex items-center gap-3 text-sm font-medium text-slate-700">
          <span>{dateStr}</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-emerald-700">Live sync active</span>
          </div>
        </div>

        {/* Notifications */}
        <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-700 relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-xs">
              {user.name?.charAt(0) ?? 'U'}
            </div>
            <span className="hidden sm:inline text-sm font-medium text-slate-900">{user.name?.split(' ')[0] ?? 'User'}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white shadow-xl z-50"
              >
                <div className="p-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
