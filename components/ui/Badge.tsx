'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export type BadgeState = 'success' | 'warning' | 'critical' | 'neutral'

const stateStyles: Record<BadgeState, string> = {
  success: 'bg-green-100 text-green-800 border border-green-200',
  warning: 'bg-amber-100 text-amber-800 border border-amber-200',
  critical: 'bg-red-100 text-red-800 border border-red-200',
  neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  state?: BadgeState
}

export function Badge({ state = 'neutral', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md',
        stateStyles[state],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
