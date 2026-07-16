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
  ChevronsLeft
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSidebar } from './SidebarContext'

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
        'group relative flex h-[44px] items-center transition-all duration-150',
        collapsed ? 'justify-center mx-4 rounded-xl' : 'gap-3 mr-4 rounded-r-full pl-8',
        isActive
          ? 'bg-blue-50 text-blue-600 font-bold'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'
      )}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0', isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600')} />
      {!collapsed && <span className="text-[14px]">{item.label}</span>}
      {collapsed && (
        <div className="pointer-events-none absolute left-full z-50 ml-3 whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          {item.label}
        </div>
      )}
    </Link>
  )
}

function NavSection({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) return <div className="my-4" />
  return (
    <div className="mb-2 mt-8 pl-8 pr-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 first:mt-2">
      {label}
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { collapsed, setCollapsed } = useSidebar()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const width = collapsed ? '88px' : '280px'
    document.documentElement.style.setProperty('--sidebar-current-width', width)
  }, [collapsed])

  const userName = session?.user?.name ?? 'Super Admin'
  const userRole = session?.user?.role === 'ADMIN' ? 'SUPER_ADMIN' : session?.user?.role ?? 'SUPER_ADMIN'

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
        className="fixed left-4 top-4 z-50 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm lg:hidden"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="h-5 w-5 text-slate-900" /> : <Menu className="h-5 w-5 text-slate-900" />}
      </button>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex h-full w-[280px] flex-col bg-white transition-all duration-300 lg:relative lg:translate-x-0 lg:flex-shrink-0 border-l-[6px] border-l-blue-600 shadow-[4px_0_24px_rgba(0,0,0,0.02)]',
          collapsed && 'lg:w-[88px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
      >
        <div className="hidden lg:flex pt-6 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "flex w-full items-center text-slate-500 transition-all hover:text-slate-900",
              collapsed ? "justify-center" : "pl-8"
            )}
          >
            <Menu className="h-6 w-6 flex-shrink-0" />
          </button>
        </div>

        <nav className="flex-1 overflow-hidden py-4 space-y-2">
          <NavSection label="Operations" collapsed={collapsed} />
          {operationsNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <NavSection label="Management" collapsed={collapsed} />
          {managementNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}

          <NavSection label="System" collapsed={collapsed} />
          {systemNav.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>




      </aside>
    </>
  )
}
