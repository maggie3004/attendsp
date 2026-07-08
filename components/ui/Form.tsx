'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

const inputStyles = 'w-full rounded-[1rem] border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 disabled:cursor-not-allowed disabled:opacity-60'

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
    <label className={cn('block text-sm font-medium text-slate-700', className)} {...props}>
      {children}
      {description ? <span className="block mt-1 text-xs text-slate-500">{description}</span> : null}
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
