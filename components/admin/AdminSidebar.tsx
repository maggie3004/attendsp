'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  MapPin,
  CalendarCheck,
  FileText,
  Settings,
  ShieldCheck,
  Menu,
  X,
  PalmtreeIcon,
  Activity,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const operationsNav = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/admin/sites', label: 'Sites', icon: MapPin },
]

const managementNav = [
  { href: '/admin/leaves', label: 'Leave Requests', icon: PalmtreeIcon },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/audit', label: 'Audit Logs', icon: Activity },
]

const systemNav = [
  { href: '/admin/settings', label: 'Settings', icon: Settings },
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
          ? 'bg-brand-50 text-brand font-semibold shadow-sm ring-1 ring-brand/20'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      )}
    >
      <Icon className={cn('h-[18px] w-[18px] flex-shrink-0', isActive ? 'text-brand' : 'text-slate-400 group-hover:text-slate-600')} />
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

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const width = collapsed ? '72px' : '260px'
    document.documentElement.style.setProperty('--sidebar-current-width', width)
  }, [collapsed])

  const userName = session?.user?.name ?? 'Admin'
  const userRole = session?.user?.role === 'ADMIN' ? 'Administrator' : session?.user?.role ?? 'Admin'

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-xl border border-surface-border bg-white p-2.5 shadow-subtle lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5 text-foreground" /> : <Menu className="h-5 w-5 text-foreground" />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full w-[260px] flex-col bg-white border-r border-slate-200/60 transition-transform duration-300 lg:relative lg:translate-x-0 lg:flex-shrink-0 shadow-sm',
          collapsed && 'lg:w-[72px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
      >
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-200/60 px-5 py-[18px]">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[15px] font-bold tracking-tight text-slate-900">AttendSP</div>
              <div className="truncate text-[11px] font-medium text-slate-500">Workforce Management</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <NavSection label="Operations" collapsed={collapsed} />
          <div className="space-y-1">
            {operationsNav.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>

          <NavSection label="Management" collapsed={collapsed} />
          <div className="space-y-1">
            {managementNav.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>

          <NavSection label="System" collapsed={collapsed} />
          <div className="space-y-1">
            {systemNav.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
                collapsed={collapsed}
                onClick={() => setMobileOpen(false)}
              />
            ))}
          </div>
        </nav>

        {!collapsed && (
          <div className="flex-shrink-0 border-t border-slate-200/60 p-3">
            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 border border-slate-100">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-slate-900">{userName}</div>
                <div className="truncate text-[11px] text-slate-500">{userRole}</div>
              </div>
              <ChevronDown className="h-4 w-4 flex-shrink-0 text-slate-400" />
            </div>
          </div>
        )}

        <div className="hidden border-t border-slate-200/60 p-3 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <Menu className="h-4 w-4" />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
