'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn('rounded-[1.5rem] bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-200', className)}
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
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between px-6 pt-6 lg:px-8 lg:pt-8', className)} {...props}>
      <div>
        {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cn('p-6 lg:p-8', className)} {...props} />
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={cn('border-t border-surface-border bg-surface/50 p-5', className)} {...props} />
}
