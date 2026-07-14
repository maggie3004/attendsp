'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const variantStyles: Record<ButtonVariant, string> = {
  default: 'bg-foreground text-white border border-foreground hover:bg-foreground/90',
  primary: 'bg-brand text-white border border-brand hover:bg-brand-600',
  secondary: 'bg-white text-foreground border border-surface-border hover:bg-surface-elevated',
  outline: 'bg-white text-foreground border border-surface-border hover:bg-surface-elevated',
  ghost: 'bg-transparent text-foreground-muted hover:bg-surface-elevated border border-transparent',
  danger: 'bg-danger text-white border border-danger hover:bg-danger/90',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm rounded-xl',
  md: 'h-10 px-4 text-sm rounded-xl',
  lg: 'h-12 px-5 text-base rounded-[1.25rem]',
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
          'inline-flex items-center justify-center gap-2 font-semibold transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
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
