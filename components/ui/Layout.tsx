'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {}
export function PageShell({ className, ...props }: PageShellProps) {
  return <div className={cn('max-w-7xl mx-auto px-6 lg:px-8 py-8', className)} {...props} />
}

export const PageContainer = PageShell

export interface PageToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}
export function PageToolbar({ className, ...props }: PageToolbarProps) {
  return <div className={cn('rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]', className)} {...props} />
}

export interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}
export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center justify-end">{action}</div>}
    </div>
  )
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}
export function Section({ className, ...props }: SectionProps) {
  return <section className={cn('flex flex-col gap-6', className)} {...props} />
}
