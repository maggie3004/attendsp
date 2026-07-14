'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function WorkerProfileSignOut() {
  return (
    <Button
      variant="outline"
      fullWidth
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-red-600 border-red-200 hover:bg-red-50"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  )
}
