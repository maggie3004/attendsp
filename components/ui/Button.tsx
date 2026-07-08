'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost'

type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-slate-900 text-white border border-slate-900 hover:bg-slate-800 focus-visible:ring-slate-300',
  primary: 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 focus-visible:ring-blue-300',
  secondary: 'bg-slate-100 text-slate-900 border border-slate-200 hover:bg-slate-200 focus-visible:ring-slate-300',
  outline: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-300',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-50 focus-visible:ring-slate-300 border border-transparent',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-10 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', fullWidth = false, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[0.75rem] font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
