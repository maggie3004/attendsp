'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[1.5rem] border border-slate-200/80 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition will-change-transform',
        className
      )}
      {...props}
    />
  )
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  action?: React.ReactNode
}

export function CardHeader({ title, description, action, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between', className)} {...props}>
      <div className="space-y-1">
        {title && <h2 className="text-lg font-semibold text-slate-900">{title}</h2>}
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6', className)} {...props} />
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('border-t border-slate-200/80 bg-slate-50/70 p-6', className)} {...props} />
}
