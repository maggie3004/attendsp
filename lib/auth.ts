import type { UserRole } from '@prisma/client'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const loginSchema = z.object({
  employeeId: z.string().min(1),
  pin: z.string().min(4).max(6),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        employeeId: { label: 'Employee ID', type: 'text' },
        pin: { label: 'PIN', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { employeeId, pin } = parsed.data

        const user = await prisma.user.findUnique({
          where: { employeeId },
          select: {
            id: true,
            employeeId: true,
            name: true,
            email: true,
            role: true,
            pinHash: true,
            isActive: true,
            profileImageUrl: true,
          },
        })

        if (!user || !user.isActive) return null

        const validPin = await bcrypt.compare(pin, user.pinHash)
        if (!validPin) return null

        return {
          id: user.id,
          employeeId: user.employeeId,
          name: user.name,
          email: user.email ?? '',
          role: user.role,
          image: user.profileImageUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.employeeId = (user as { employeeId?: string }).employeeId
        token.role = (user as { role?: UserRole }).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.employeeId = token.employeeId as string
        session.user.role = token.role as UserRole
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
})
