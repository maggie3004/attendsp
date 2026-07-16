'use client'

import type { ReactNode } from 'react'
import { Search, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { Sparkline } from '@/components/ui/Sparkline'

interface PageHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  eyebrow?: string
}

export function PageHeader({ title, description, action, eyebrow }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        {eyebrow && <p className="section-kicker">{eyebrow}</p>}
        <h1 className="text-[24px] font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="max-w-2xl text-sm text-foreground-muted">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center">{action}</div>}
    </div>
  )
}

interface PageToolbarProps {
  children: ReactNode
  className?: string
}

export function PageToolbar({ children, className }: PageToolbarProps) {
  return (
    <div className={cn('flex flex-col gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-card', className)}>
      {children}
    </div>
  )
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
    <section className={cn('space-y-5', className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            {title && <h2 className="text-lg font-bold text-foreground">{title}</h2>}
            {description && <p className="text-sm text-foreground-muted">{description}</p>}
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
  sparkData?: number[]
  sparkColor?: string
  className?: string
}

export function StatsCard({ label, value, icon, sublabel, change, trend, tone, sparkData, sparkColor, className }: StatsCardProps) {
  const trendColor = trend === 'down' ? 'text-red-600' : trend === 'up' ? 'text-emerald-600' : 'text-foreground-muted'

  return (
    <Card className={cn('overflow-hidden bg-white rounded-xl border border-slate-200/60 shadow-sm', className)}>
      <div className="flex flex-col p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', tone || 'bg-slate-100')}>
            {icon}
          </div>
          {change && (
            <div className={cn('inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold', trendColor, trend === 'down' ? 'bg-red-50' : trend === 'up' ? 'bg-emerald-50' : 'bg-slate-50')}>
              {change}
            </div>
          )}
        </div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <p className="mt-1 text-4xl font-bold tracking-tight text-slate-900">{value}</p>
        {sublabel && <p className="mt-2 text-xs text-slate-400">{sublabel}</p>}
        {sparkData && (
          <div className="mt-4 h-[32px] w-full">
            <Sparkline data={sparkData} color={sparkColor ?? '#2563EB'} height={32} className="w-full" />
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
    <Card className={cn('p-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-foreground-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
          {description && <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>}
        </div>
        {icon && <div className="rounded-xl bg-surface p-2.5 text-foreground-subtle">{icon}</div>}
      </div>
    </Card>
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
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
          {description && <p className="mt-0.5 text-xs text-foreground-muted">{description}</p>}
        </div>
        {icon}
      </div>
      {value !== undefined && <p className="mt-3 text-2xl font-bold text-foreground">{value}</p>}
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
    <Card className={cn('overflow-hidden', className)}>
      {(title || description || action) && (
        <div className="flex flex-col gap-2 border-b border-surface-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-foreground-muted">{description}</p>}
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
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-10" />
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className }: SearchBarProps) {
  return <SearchBar value={value} onChange={onChange} placeholder={placeholder} className={className} />
}

interface ActionBarProps {
  children: ReactNode
  className?: string
}

export function ActionBar({ children, className }: ActionBarProps) {
  return <div className={cn('flex flex-wrap items-center gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-card', className)}>{children}</div>
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
        <div className="flex flex-col gap-2 border-b border-surface-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h3 className="text-base font-semibold text-foreground">{title}</h3>}
            {description && <p className="text-xs text-foreground-muted">{description}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-6 lg:p-8">{children}</div>
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
    <div className="flex flex-col items-center justify-center gap-6 rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        <Icon className="h-6 w-6 text-slate-400" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
        {onPrimary && <Button variant="primary" size="sm" onClick={onPrimary} className="px-5">{primaryLabel}</Button>}
        {onSecondary && <Button variant="outline" size="sm" onClick={onSecondary} className="px-5">{secondaryLabel}</Button>}
      </div>
    </div>
  )
}

export function TableToolbar({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-surface-border bg-white p-4 shadow-card', className)}>{children}</div>
}

interface StatusBadgeProps {
  label: string
  tone: 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  const classes = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-surface-elevated text-foreground-muted border-surface-border',
  }

  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold', classes[tone])}>
      {label}
    </span>
  )
}

export function PriorityBadge({ label, tone }: { label: string; tone: 'high' | 'medium' | 'low' | 'neutral' }) {
  const classes = {
    high: 'bg-red-50 text-red-700',
    medium: 'bg-amber-50 text-amber-700',
    low: 'bg-emerald-50 text-emerald-700',
    neutral: 'bg-surface-elevated text-foreground-muted',
  }
  return <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold', classes[tone])}>{label}</span>
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    WORKER: 'bg-surface-elevated text-foreground-muted',
    SUPERVISOR: 'bg-blue-50 text-blue-700',
    CONTRACTOR: 'bg-amber-50 text-amber-700',
    ADMIN: 'bg-red-50 text-red-700',
  }
  return <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold', map[role.toUpperCase()] ?? 'bg-surface-elevated text-foreground-muted')}>{role}</span>
}
