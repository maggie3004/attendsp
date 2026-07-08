'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
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
  ChevronRight,
  PalmtreeIcon,
  Activity,
  Building2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/employees', label: 'Employees', icon: Users },
  { href: '/admin/sites', label: 'Sites', icon: MapPin },
  { href: '/admin/attendance', label: 'Attendance', icon: CalendarCheck },
  { href: '/admin/leaves', label: 'Leave Requests', icon: PalmtreeIcon },
  { href: '/admin/reports', label: 'Reports', icon: FileText },
  { href: '/admin/audit', label: 'Audit Logs', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

function NavItem({
  item,
  isActive,
  collapsed,
  onClick,
}: {
  item: (typeof navItems)[0]
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
        'group relative flex h-11 items-center gap-3 rounded-[0.75rem] px-3 transition-all duration-200',
        isActive
          ? 'bg-blue-50 text-blue-700 shadow-sm'
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      )}
    >
      <div className={cn('rounded-xl p-2', isActive ? 'bg-white text-blue-600' : 'bg-slate-50 text-slate-500 group-hover:bg-white')}>
        <Icon className="h-4 w-4" />
      </div>
      {!collapsed && <span className="text-sm font-semibold tracking-tight">{item.label}</span>}
      {isActive && !collapsed && <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />}
      {collapsed && (
        <div className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-xl border border-slate-200 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {item.label}
        </div>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const width = collapsed ? '72px' : '220px'
    document.documentElement.style.setProperty('--sidebar-current-width', width)
  }, [collapsed])

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5 text-slate-700" /> : <Menu className="h-5 w-5 text-slate-700" />}
      </button>

      <motion.aside
        animate={{ width: collapsed ? 72 : 280 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-slate-200 bg-white/95 backdrop-blur lg:relative lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-transform duration-300 lg:transition-none'
        )}
        style={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
      >
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-slate-200 px-5 py-5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[0.85rem] bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-[1rem] font-semibold tracking-tight text-slate-900">AttendSP</div>
              <div className="truncate text-xs text-slate-500">Workforce Management Platform</div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-3 px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Operations</div>
          {navItems.slice(0, 4).map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <div className="mt-4 mb-3 px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Management</div>
          {navItems.slice(4, 7).map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <div className="mt-4 mb-3 px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">System</div>
          {navItems.slice(7).map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        <div className="hidden border-t border-slate-200 p-3 lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-[0.75rem] px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <Menu className="h-4 w-4" />
            {!collapsed ? <span>Collapse</span> : <span>Expand</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
