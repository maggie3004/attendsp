'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'

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
    <div className="flex min-h-dvh items-center justify-center bg-[radial-gradient(circle_at_top,_#f8fbff_0%,_#ffffff_55%)] p-4">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-[0_16px_40px_rgba(37,99,235,0.24)]">
            <ShieldCheck className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Attend<span className="text-blue-600">SP</span></h1>
          <p className="mt-1 text-sm text-slate-500">Construction workforce attendance platform</p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-[0_16px_50px_rgba(15,23,42,0.08)]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Employee ID */}
            <div className="space-y-1.5">
              <label htmlFor="employeeId" className="text-sm font-medium text-slate-700">
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                placeholder="EMP-0001"
                autoComplete="username"
                autoFocus
                className={`w-full rounded-2xl border bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.employeeId ? 'border-rose-400' : 'border-slate-200'}`}
                {...register('employeeId')}
              />
              {errors.employeeId && (
                <p className="text-xs text-red-500">{errors.employeeId.message}</p>
              )}
            </div>

            {/* PIN */}
            <div className="space-y-1.5">
              <label htmlFor="pin" className="text-sm font-medium text-slate-700">
                PIN
              </label>
              <div className="relative">
                <input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  placeholder="Enter your PIN"
                  autoComplete="current-password"
                  inputMode="numeric"
                  maxLength={6}
                  className={`w-full rounded-2xl border bg-white px-4 py-3 pr-12 text-base tracking-widest text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${errors.pin ? 'border-rose-400' : 'border-slate-200'}`}
                  {...register('pin')}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.pin && (
                <p className="text-xs text-red-500">{errors.pin.message}</p>
              )}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 text-base font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.24)] transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">Multi-site attendance tracking for modern construction teams</p>
      </motion.div>
    </div>
  )
}
