'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Home,
  CalendarCheck,
  History,
  PalmtreeIcon,
  User,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const workerNav = [
  { href: '/worker', label: 'Home', icon: Home, exact: true },
  { href: '/worker/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/worker/history', label: 'History', icon: History },
  { href: '/worker/leave', label: 'Leave', icon: PalmtreeIcon },
  { href: '/worker/profile', label: 'Profile', icon: User },
]

function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: { href: string; label: string; icon: React.ComponentType<{ className?: string }> }
  isActive: boolean
  collapsed: boolean
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        'group relative flex h-[40px] items-center gap-3 rounded-xl px-3.5 transition-all duration-200',
        isActive
          ? 'bg-slate-800 text-white shadow-sm'
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      )}
    >
      <Icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200')} />
      {!collapsed && <span className="text-[13px] font-medium">{item.label}</span>}
      {collapsed && (
        <div className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {item.label}
        </div>
      )}
    </Link>
  )
}

function NavSection({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-2" />
  return (
    <div className="mb-2 mt-6 px-4 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500/80 first:mt-2">
      {label}
    </div>
  )
}

export function WorkerSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Listen for custom event to open sidebar from header
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev)
    window.addEventListener('toggleWorkerSidebar', handleToggle)
    return () => window.removeEventListener('toggleWorkerSidebar', handleToggle)
  }, [])

  useEffect(() => {
    const width = collapsed ? '72px' : '260px'
    document.documentElement.style.setProperty('--sidebar-current-width', width)
  }, [collapsed])

  const userName = session?.user?.name ?? 'Worker'
  const userRole = 'Field Worker'

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-slate-950/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-[70] flex h-full w-[260px] flex-col bg-sidebar transition-all duration-300 lg:relative lg:translate-x-0 lg:flex-shrink-0',
          collapsed && 'lg:w-[72px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-slate-700/40 px-5 py-[18px]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="text-[15px] font-bold tracking-tight text-white">AttendSP</div>
                <div className="truncate text-[11px] text-slate-400">Worker Portal</div>
              </div>
            )}
          </div>
          <button
            className="lg:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection label="My App" collapsed={collapsed} />
          <div className="space-y-1">
            {workerNav.map((item) => {
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname.startsWith(item.href)

              return (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  onClick={() => setMobileOpen(false)}
                />
              )
            })}
          </div>
        </nav>

        {!collapsed && (
          <div className="flex-shrink-0 border-t border-slate-700/50 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-black/20 px-3 py-2.5">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-white">{userName}</div>
                <div className="truncate text-[11px] text-slate-400">{userRole}</div>
              </div>
            </div>
          </div>
        )}

        <div className="hidden border-t border-slate-700/50 p-3 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-sidebar-hover hover:text-slate-200"
          >
            <Menu className="h-4 w-4" />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
