'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const inputStyles = 'w-full h-12 rounded-[1rem] border border-slate-300 bg-white px-4 text-sm text-foreground shadow-sm transition duration-200 placeholder:text-foreground-subtle focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand/20 disabled:cursor-not-allowed disabled:opacity-60'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input({ className, ...props }: InputProps) {
  return <input className={cn(inputStyles, className)} {...props} />
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea className={cn(inputStyles, 'min-h-[9rem] resize-none', className)} {...props} />
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn(inputStyles, 'appearance-none bg-white', className)} {...props}>
      {children}
    </select>
  )
}

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  description?: string
}
export function Label({ className, description, children, ...props }: LabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-foreground', className)} {...props}>
      {children}
      {description ? <span className="block mt-1 text-xs text-foreground-muted">{description}</span> : null}
    </label>
  )
}

export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: string
  children: React.ReactNode
}
export function FormField({ label, description, className, children, ...props }: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <Label description={description}>{label}</Label>
      {children}
    </div>
  )
}
