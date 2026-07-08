import type { UserRole } from '@prisma/client'
import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      employeeId: string
      role: UserRole
    } & DefaultSession['user']
  }

  interface User {
    id: string
    employeeId: string
    role: UserRole
  }
}

