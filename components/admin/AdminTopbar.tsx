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
  SUPER_ADMIN: 'text-purple-500',
  ADMIN: 'text-brand',
  SUPERVISOR: 'text-amber-500',
  WORKER: 'text-green-500',
}

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

  return (
    <header className="h-14 flex-shrink-0 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Left: date */}
      <div className="flex items-center gap-2 ml-10 lg:ml-0">
        <div className="text-sm text-gray-400">
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
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-700">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-medium text-gray-800 leading-tight">{user.name || 'Unknown'}</div>
              <div className={cn('text-xs leading-tight', ROLE_COLORS[user.role])}>
                {ROLE_LABELS[user.role]}
              </div>
            </div>
            <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform duration-200', menuOpen && 'rotate-180')} />
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl p-1.5 z-50 shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <div className="px-3 py-2.5 border-b border-gray-200 mb-1.5">
                  <div className="text-sm font-medium text-gray-800">{user.name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{user.employeeId}</div>
                </div>
                <button
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
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
