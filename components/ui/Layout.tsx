'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface PageShellProps extends React.HTMLAttributes<HTMLDivElement> {}
export function PageShell({ className, ...props }: PageShellProps) {
  return <div className={cn('mx-auto max-w-[1480px] px-4 py-8 sm:px-6 lg:px-10', className)} {...props} />
}

export const PageContainer = PageShell

export interface PageToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}
export function PageToolbar({ className, ...props }: PageToolbarProps) {
  return <div className={cn('rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]', className)} {...props} />
}

export interface SectionHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
}
export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="text-[2.25rem] font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-base text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center justify-end">{action}</div>}
    </div>
  )
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {}
export function Section({ className, ...props }: SectionProps) {
  return <section className={cn('space-y-8', className)} {...props} />
}
