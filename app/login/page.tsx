'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, ShieldCheck, HardHat } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { Card, CardContent } from '@/components/ui/Card'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const router = useRouter()
  const [showPin, setShowPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        employeeId: data.employeeId,
        pin: data.pin,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid Employee ID or PIN. Please try again.')
      } else {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        const role = session?.user?.role
        if (role === 'WORKER') {
          router.push('/worker/attendance')
        } else {
          router.push('/admin/dashboard')
        }
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-sm">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            AttendSP
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Workforce Attendance & Site Operations Platform
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="p-8">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField label="Employee ID">
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="EMP-0001"
                  autoComplete="username"
                  autoFocus
                  className={cn("h-12 w-full px-4 rounded-xl border border-slate-300 bg-white text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20", errors.employeeId && 'border-red-300 focus:border-red-400 focus:ring-red-500/10')}
                  {...register('employeeId')}
                />
                {errors.employeeId && (
                  <p className="text-xs text-red-600">{errors.employeeId.message}</p>
                )}
              </FormField>

              <FormField label="PIN">
                <div className="relative">
                  <Input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    placeholder="Enter your PIN"
                    autoComplete="current-password"
                    inputMode="numeric"
                    maxLength={6}
                    className={cn(
                      'h-12 w-full px-4 pr-12 rounded-xl border border-slate-300 bg-white text-sm tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
                      errors.pin && 'border-red-300 focus:border-red-400 focus:ring-red-500/10'
                    )}
                    {...register('pin')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.pin && (
                  <p className="text-xs text-red-600">{errors.pin.message}</p>
                )}
              </FormField>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-base font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-foreground-subtle">
          Secure face + GPS verified attendance
        </p>
      </motion.div>
    </div>
  )
}
