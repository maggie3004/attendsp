'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle2, Loader2, PalmtreeIcon } from 'lucide-react'
import { applyLeaveSchema, type ApplyLeaveInput } from '@/lib/validations'
import { format } from 'date-fns'
import { Card, CardContent } from '@/components/ui/Card'
import { FormField, Input, Select, Textarea } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

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
    <div className="flex flex-col gap-7 px-5 pt-6 pb-10 animate-fade-in">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="shadow-xl shadow-black/5 rounded-[2rem] border-none">
              <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-emerald-600">Leave Applied Successfully!</h2>
                  <p className="mt-2 text-sm text-foreground-muted">
                    Your request has been submitted and is pending admin approval.
                  </p>
                </div>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Apply Another
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="shadow-xl shadow-black/5 rounded-[2rem] border-none">
              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <FormField label="Leave type">
                    <Select {...register('type')}>
                      <option value="CASUAL">Casual Leave</option>
                      <option value="SICK">Sick Leave</option>
                      <option value="ANNUAL">Annual Leave</option>
                      <option value="EMERGENCY">Emergency Leave</option>
                      <option value="UNPAID">Unpaid Leave</option>
                      <option value="COMPENSATORY">Compensatory Leave</option>
                    </Select>
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="From">
                      <Input type="date" {...register('startDate')} />
                    </FormField>
                    <FormField label="To">
                      <Input type="date" {...register('endDate')} />
                    </FormField>
                  </div>

                  <FormField label="Reason">
                    <Textarea
                      {...register('reason')}
                      rows={4}
                      placeholder="Please provide a reason for your leave request..."
                    />
                    {errors.reason && (
                      <p className="text-xs text-red-600">{errors.reason.message}</p>
                    )}
                  </FormField>

                  <label className="flex items-center gap-3 cursor-pointer rounded-xl border border-surface-border p-3 hover:bg-surface transition">
                    <input type="checkbox" {...register('isEmergency')} className="h-4 w-4 accent-brand cursor-pointer" />
                    <span className="text-sm font-medium text-foreground">Mark as emergency leave</span>
                  </label>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                      {error}
                    </motion.div>
                  )}

                  <Button type="submit" variant="primary" size="lg" fullWidth disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Leave Request'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
