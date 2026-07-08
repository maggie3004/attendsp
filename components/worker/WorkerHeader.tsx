'use client'

import { signOut } from 'next-auth/react'
import { ShieldCheck, LogOut, Bell } from 'lucide-react'
import type { UserRole } from '@prisma/client'
import { format } from 'date-fns'

interface WorkerHeaderProps {
  user: {
    name?: string | null
    employeeId: string
    role: UserRole
  }
}

export function WorkerHeader({ user }: WorkerHeaderProps) {
  const today = format(new Date(), 'EEEE, d MMMM yyyy')
  
  return (
    <header className="bg-gradient-to-br from-blue-600 to-blue-700 sticky top-0 z-30 shadow-lg shadow-blue-600/20 safe-top">
      <div className="flex items-start justify-between gap-4 px-4 py-6">
        <div className="flex-1 text-white">
          <p className="text-sm font-medium opacity-90">Good morning,</p>
          <h1 className="text-2xl font-bold mt-1">{user.name?.split(' ')[0] ?? 'Worker'}</h1>
          <p className="text-xs opacity-80 mt-2">{today}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-red-500/40"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

