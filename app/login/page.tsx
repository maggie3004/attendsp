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
    <div className="min-h-dvh bg-[#f8f9fb] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand mb-4 shadow-md">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Attend<span className="gradient-text">SP</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Workforce Attendance System
          </p>
        </div>

        {/* Card */}
        <div className="card p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Employee ID */}
            <div className="space-y-1.5">
              <label htmlFor="employeeId" className="text-sm font-medium text-gray-700">
                Employee ID
              </label>
              <input
                id="employeeId"
                type="text"
                placeholder="EMP-0001"
                autoComplete="username"
                autoFocus
                className={`
                  w-full px-4 py-3 rounded-xl bg-white border text-gray-900
                  placeholder:text-gray-300 text-base
                  focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                  transition-all duration-200
                  ${errors.employeeId ? 'border-red-400' : 'border-gray-200'}
                `}
                {...register('employeeId')}
              />
              {errors.employeeId && (
                <p className="text-xs text-red-500">{errors.employeeId.message}</p>
              )}
            </div>

            {/* PIN */}
            <div className="space-y-1.5">
              <label htmlFor="pin" className="text-sm font-medium text-gray-700">
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
                  className={`
                    w-full px-4 py-3 pr-12 rounded-xl bg-white border text-gray-900
                    placeholder:text-gray-300 text-base tracking-widest
                    focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500
                    transition-all duration-200
                    ${errors.pin ? 'border-red-400' : 'border-gray-200'}
                  `}
                  {...register('pin')}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
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
                  className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="
                w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-base
                hover:opacity-90 active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-2 shadow-md
              "
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

        <p className="text-center text-xs text-gray-400 mt-6">
          Multi-Site Attendance Tracking
        </p>
      </motion.div>
    </div>
  )
}
