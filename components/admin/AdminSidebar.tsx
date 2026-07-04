'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
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
        'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
        isActive
          ? 'bg-indigo-50 text-brand border border-indigo-100'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
      )}
    >
      <Icon className={cn('w-5 h-5 flex-shrink-0 transition-transform duration-200', isActive && 'scale-110')} />
      {!collapsed && (
        <span className="text-sm font-medium truncate">{item.label}</span>
      )}
      {isActive && !collapsed && (
        <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
      )}
      {collapsed && (
        <div className="absolute left-full ml-3 px-2 py-1 rounded-lg bg-white border border-gray-200 text-xs font-medium whitespace-nowrap text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-sm">
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

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-white border border-gray-200 shadow-sm lg:hidden"
      >
        {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
      </button>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={cn(
          'flex-shrink-0 h-full bg-white border-r border-gray-200 flex flex-col',
          'fixed inset-y-0 left-0 z-40 lg:relative lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          'transition-transform duration-300 lg:transition-none'
        )}
        style={{ width: collapsed ? 64 : 240 }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-200 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl gradient-brand flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-base tracking-tight text-gray-900">
              Attend<span className="gradient-text">SP</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              collapsed={collapsed}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="p-3 border-t border-gray-200 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all text-sm"
          >
            <Menu className="w-4 h-4" />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  )
}
