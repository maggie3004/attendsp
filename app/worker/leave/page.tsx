'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2, Loader2, Calendar } from 'lucide-react'
import { applyLeaveSchema, type ApplyLeaveInput } from '@/lib/validations'
import { format } from 'date-fns'

export default function WorkerLeavePage() {
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<ApplyLeaveInput>({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      isEmergency: false,
    },
  })

  async function onSubmit(data: ApplyLeaveInput) {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/leaves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? 'Failed to submit')
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Apply for Leave</h1>
        <p className="text-sm text-foreground/50 mt-0.5">Submit a leave request for admin approval</p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8 flex flex-col items-center gap-5 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-400">Leave Applied!</h2>
              <p className="text-sm text-foreground/50 mt-1">Your request has been submitted and is pending admin approval.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-sm text-foreground/70 hover:text-foreground transition-colors">
              Apply Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="card p-5 space-y-5"
          >
            {/* Leave Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/70">Leave Type</label>
              <select {...register('type')} className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-foreground text-sm focus:outline-none focus:border-brand/50">
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="ANNUAL">Annual Leave</option>
                <option value="EMERGENCY">Emergency Leave</option>
                <option value="UNPAID">Unpaid Leave</option>
                <option value="COMPENSATORY">Compensatory Leave</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/70">From</label>
                <input type="date" {...register('startDate')} className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-foreground text-sm focus:outline-none focus:border-brand/50" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground/70">To</label>
                <input type="date" {...register('endDate')} className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-foreground text-sm focus:outline-none focus:border-brand/50" />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground/70">Reason</label>
              <textarea
                {...register('reason')}
                rows={4}
                placeholder="Please provide a reason for your leave request..."
                className="w-full px-4 py-3 rounded-xl bg-surface-elevated border border-surface-border text-foreground text-sm focus:outline-none focus:border-brand/50 resize-none placeholder:text-foreground/25"
              />
              {errors.reason && <p className="text-xs text-red-400">{errors.reason.message}</p>}
            </div>

            {/* Emergency toggle */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" {...register('isEmergency')} className="w-4 h-4 accent-brand" />
              <span className="text-sm text-foreground/70">Mark as Emergency Leave</span>
            </label>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl gradient-brand text-white font-semibold text-sm shadow-glow hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting...</> : 'Submit Leave Request'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
