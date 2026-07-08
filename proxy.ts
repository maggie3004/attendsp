import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Route access matrix
const ROUTE_RULES: Record<string, string[]> = {
  '/admin': ['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR'],
  '/worker': ['WORKER', 'SUPER_ADMIN', 'ADMIN', 'SUPERVISOR'],
}

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl
  const session = req.auth

  // Public routes
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    // Redirect authenticated users away from login
    if (session?.user && pathname.startsWith('/login')) {
      const role = session.user.role
      const redirect = role === 'WORKER' ? '/worker/attendance' : '/admin/dashboard'
      return NextResponse.redirect(new URL(redirect, req.url))
    }
    return NextResponse.next()
  }

  // Protected routes — require authentication
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Role-based access control
  const userRole = session.user.role
  for (const [prefix, allowedRoles] of Object.entries(ROUTE_RULES)) {
    if (pathname.startsWith(prefix)) {
      if (!allowedRoles.includes(userRole ?? '')) {
        // Redirect to appropriate home
        const home = userRole === 'WORKER' ? '/worker/attendance' : '/admin/dashboard'
        return NextResponse.redirect(new URL(home, req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|uploads|models|icons|manifest.json).*)'],
}
