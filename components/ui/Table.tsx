'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TableContainerProps extends React.HTMLAttributes<HTMLDivElement> {}
export function TableContainer({ className, ...props }: TableContainerProps) {
  return <div className={cn('overflow-x-auto rounded-[1.5rem] border border-slate-200/80 bg-white shadow-sm', className)} {...props} />
}

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}
export function Table({ className, ...props }: TableProps) {
  return <table className={cn('min-w-full border-separate border-spacing-0 text-sm', className)} {...props} />
}

export interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableHead({ className, ...props }: TableHeadProps) {
  return <thead className={cn('bg-slate-50', className)} {...props} />
}

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={cn('divide-y divide-slate-200/80', className)} {...props} />
}

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
export function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cn('transition-colors duration-200 hover:bg-slate-50/80', className)} {...props} />
}

export interface TableHeaderCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
export function TableHeaderCell({ className, ...props }: TableHeaderCellProps) {
  return <th className={cn('px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500', className)} {...props} />
}

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}
export function TableCell({ className, ...props }: TableCellProps) {
  return <td className={cn('px-5 py-4 align-top text-sm text-slate-700 border-t border-slate-200/80', className)} {...props} />
}
