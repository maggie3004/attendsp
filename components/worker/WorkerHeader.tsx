'use client'

import { signOut } from 'next-auth/react'
import { ShieldCheck, LogOut, Bell } from 'lucide-react'
import type { UserRole } from '@prisma/client'

interface WorkerHeaderProps {
  user: {
    name?: string | null
    employeeId: string
    role: UserRole
  }
}

export function WorkerHeader({ user }: WorkerHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white safe-top sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight text-slate-900">
          Attend<span className="text-brand">SP</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-400 hover:text-gray-600">
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="p-2 rounded-xl hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
