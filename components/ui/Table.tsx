'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {}
export function TableContainer({ className, ...props }: TableContainerProps) {
  return <div className={cn('overflow-x-auto rounded-2xl border border-surface-border bg-white shadow-card', className)} {...props} />
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export function Table({ className, ...props }: TableProps) {
  return <table className={cn('min-w-full border-separate border-spacing-0 text-sm', className)} {...props} />
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn('divide-y divide-surface-border', className)} {...props} />
}

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-b border-surface-border transition-colors hover:bg-slate-50 data-[state=selected]:bg-brand-50',
      className
    )}
    {...props}
  />
))
TableRow.displayName = 'TableRow'

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-surface-elevated sticky top-0 z-10 text-xs font-semibold uppercase tracking-wider text-foreground-muted shadow-[0_1px_0_var(--color-surface-border)]', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

export const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'px-4 py-3 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
      className
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}
export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn('px-4 py-3 align-middle text-sm text-foreground border-t border-surface-border', className)} {...props} />
}
