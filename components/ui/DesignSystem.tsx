'use client'

import type { ReactNode } from 'react'
import { Search, Users, CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  eyebrow?: string
}

export function PageHeader({ title, description, action, eyebrow }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 rounded-[1.75rem] border border-slate-200/70 bg-slate-50/80 p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {description && <p className="max-w-2xl text-base leading-7 text-slate-600">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center justify-end">{action}</div>}
    </div>
  )
}

interface PageToolbarProps {
  children: ReactNode
  className?: string
}

export function PageToolbar({ children, className }: PageToolbarProps) {
  return <div className={cn('flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)]', className)}>{children}</div>
}

interface PageSectionProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function PageSection({ title, description, action, children, className }: PageSectionProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            {title && <h2 className="text-[1.25rem] font-semibold tracking-tight text-slate-900">{title}</h2>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

interface StatsCardProps {
  label: string
  value: string | number
  icon: ReactNode
  sublabel?: string
  status?: string
  change?: string
  trend?: 'up' | 'down' | 'steady'
  accent?: string
  tone?: string
  className?: string
}

export function StatsCard({ label, value, icon, sublabel, status, change, trend, accent, tone, className }: StatsCardProps) {
  const trendClasses = trend === 'down' ? 'bg-red-50 text-red-600' : trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'

  return (
    <Card className={cn('rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(15,23,42,0.12)]', className)}>
      <div className="flex items-center justify-between gap-4">
        <div className={cn('grid h-14 w-14 place-items-center rounded-3xl', tone || 'bg-slate-100')}>
          <div className={cn(accent)}>{icon}</div>
        </div>
        {status && <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">{status}</span>}
      </div>

      <div className="mt-6 space-y-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>

        {sublabel && <p className="text-sm text-slate-500">{sublabel}</p>}

        {(change || trend) && (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {change && <span className={cn('rounded-full px-2.5 py-1 font-semibold', trendClasses)}>{change}</span>}
            {trend && <span className="text-slate-500">{trend === 'up' ? 'Improving' : trend === 'down' ? 'Declining' : 'Stable'}</span>}
          </div>
        )}
      </div>
    </Card>
  )
}

interface MetricCardProps {
  label: string
  value: string | number
  description?: string
  icon?: ReactNode
  className?: string
}

export function MetricCard({ label, value, description, icon, className }: MetricCardProps) {
  return (
    <Card className={cn('rounded-[1rem] border border-slate-200 bg-white p-4 shadow-sm', className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-2 text-[1.5rem] font-semibold text-slate-900">{value}</p>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {icon && <div className="rounded-2xl bg-slate-50 p-2.5 text-slate-500">{icon}</div>}
      </div>
    </Card>
  )
}

interface MetricBadgeProps {
  label: string
  value: string | number
}

export function MetricBadge({ label, value }: MetricBadgeProps) {
  return (
    <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
      <span className="font-semibold text-slate-900">{value}</span> {label}
    </div>
  )
}

interface InfoCardProps {
  title: string
  description?: string
  value?: string | number
  icon?: ReactNode
  className?: string
}

export function InfoCard({ title, description, value, icon, className }: InfoCardProps) {
  return (
    <Card className={cn('rounded-[1.25rem] border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.06)]', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {icon}
      </div>
      {value !== undefined && <p className="mt-4 text-[1.5rem] font-semibold tracking-tight text-slate-900">{value}</p>}
    </Card>
  )
}

interface DataTableProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function DataTable({ title, description, action, children, className }: DataTableProps) {
  return (
    <Card className={cn('rounded-[1rem] border border-slate-200 bg-white shadow-sm', className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {title && <h3 className="text-base font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </Card>
  )
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search...', className }: SearchBarProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-11" />
    </div>
  )
}

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchInputProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-11" />
    </div>
  )
}

interface ActionBarProps {
  children: ReactNode
  className?: string
}

export function ActionBar({ children, className }: ActionBarProps) {
  return <div className={cn('flex flex-wrap items-center gap-3 rounded-[1rem] border border-slate-200 bg-white p-4 shadow-sm', className)}>{children}</div>
}

interface SectionCardProps {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
}

export function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 border-b border-slate-200/80 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            {title && <h3 className="text-[1rem] font-semibold text-slate-900">{title}</h3>}
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </Card>
  )
}

interface EmptyStateProps {
  title?: string
  description?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimary?: () => void
  onSecondary?: () => void
  icon?: LucideIcon
}

export function EmptyState({ title = 'No records yet', description = 'There is nothing to show right now.', primaryLabel = 'Create', secondaryLabel, onPrimary, onSecondary, icon: Icon = Users }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
      <div className="rounded-full bg-white p-3 shadow-sm">
        <Icon className="h-7 w-7 text-slate-400" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onPrimary && <Button variant="primary" size="sm" onClick={onPrimary}>{primaryLabel}</Button>}
        {onSecondary && <Button variant="outline" size="sm" onClick={onSecondary}>{secondaryLabel}</Button>}
      </div>
    </div>
  )
}

interface TableToolbarProps {
  children: ReactNode
  className?: string
}

export function TableToolbar({ children, className }: TableToolbarProps) {
  return <div className={cn('flex flex-wrap items-center justify-between gap-3 rounded-[1rem] border border-slate-200 bg-white p-4 shadow-sm', className)}>{children}</div>
}

interface StatusBadgeProps {
  label: string
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const classes = {
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
    info: 'bg-blue-50 text-blue-700 ring-blue-200',
    neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  }

  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset', classes[tone])}>{label}</span>
}

interface PriorityBadgeProps {
  label: string
  tone: 'high' | 'medium' | 'low' | 'neutral'
}

export function PriorityBadge({ label, tone }: PriorityBadgeProps) {
  const classes = {
    high: 'bg-rose-50 text-rose-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-emerald-50 text-emerald-700',
    neutral: 'bg-slate-100 text-slate-700',
  }
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold', classes[tone])}>{label}</span>
}

interface RoleBadgeProps {
  role: string
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const map: Record<string, { bg: string; color: string }> = {
    WORKER: { bg: 'bg-slate-50', color: 'text-slate-700' },
    SUPERVISOR: { bg: 'bg-blue-50', color: 'text-blue-700' },
    CONTRACTOR: { bg: 'bg-amber-50', color: 'text-amber-700' },
    ADMIN: { bg: 'bg-rose-50', color: 'text-rose-700' },
  }

  const token = map[role.toUpperCase()] ?? { bg: 'bg-slate-50', color: 'text-slate-700' }

  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', token.bg, token.color)}>{role}</span>
}
