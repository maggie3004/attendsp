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

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(applyLeaveSchema),
    defaultValues: {
      type: 'CASUAL' as const,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-4 py-6 animate-fade-in">
      <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Apply for Leave</h1>
        <p className="text-sm text-slate-500 mt-2">Submit a leave request for admin approval</p>
      </div>

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[1.5rem] border border-slate-200/80 bg-white p-8 flex flex-col items-center gap-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-emerald-600">Leave Applied Successfully!</h2>
              <p className="text-sm text-slate-500 mt-2">Your request has been submitted and is pending admin approval. You'll be notified once reviewed.</p>
            </div>
            <button onClick={() => setSubmitted(false)} className="px-6 py-2.5 rounded-[1rem] bg-blue-50 border border-blue-200 text-sm font-semibold text-blue-600 hover:bg-blue-100 transition-colors">
              Apply Another
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 space-y-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
          >
            {/* Leave Type Section */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-3">Leave Details</p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Leave Type</label>
                <select {...register('type')} className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium">
                  <option value="CASUAL">Casual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                  <option value="COMPENSATORY">Compensatory Leave</option>
                </select>
              </div>
            </div>

            {/* Date Range Section */}
            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-3">Duration</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">From</label>
                  <input type="date" {...register('startDate')} className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-900">To</label>
                  <input type="date" {...register('endDate')} className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10" />
                </div>
              </div>
            </div>

            {/* Reason Section */}
            <div className="border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 mb-3">Additional Info</p>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-900">Reason</label>
                <textarea
                  {...register('reason')}
                  rows={4}
                  placeholder="Please provide a reason for your leave request..."
                  className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 resize-none placeholder:text-slate-400"
                />
                {errors.reason && <p className="text-xs text-red-500 font-medium mt-1">{errors.reason.message}</p>}
              </div>
            </div>

            {/* Emergency toggle */}
            <div className="border-t border-slate-100 pt-6">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 transition">
                <input type="checkbox" {...register('isEmergency')} className="w-4 h-4 accent-blue-600 cursor-pointer" />
                <span className="text-sm font-medium text-slate-900">Mark as Emergency Leave</span>
              </label>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600 font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-[1.2rem] bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:shadow-lg hover:shadow-blue-600/30 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 mt-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Leave Request'
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
