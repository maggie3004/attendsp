'use client'

import { signOut } from 'next-auth/react'
import { ShieldCheck, LogOut, Bell } from 'lucide-react'
import type { UserRole } from '@prisma/client'

interface WorkerHeaderProps {
  user: {
    name: string
    employeeId: string
    role: UserRole
  }
}

export function WorkerHeader({ user }: WorkerHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-3.5 border-b border-surface-border bg-surface-card/90 backdrop-blur-sm safe-top sticky top-0 z-30">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight">
          Attend<span className="gradient-text">SP</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button className="p-2 rounded-xl hover:bg-surface-elevated transition-colors text-foreground/50">
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="p-2 rounded-xl hover:bg-surface-elevated transition-colors text-foreground/50"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
