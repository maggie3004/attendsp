'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEmployeeSchema, type CreateEmployeeInput } from '@/lib/validations'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, SectionCard } from '@/components/ui/DesignSystem'
import { FormField, Input, Select } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

export default function NewEmployeePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CreateEmployeeInput>({ resolver: zodResolver(createEmployeeSchema) })

  async function onSubmit(data: CreateEmployeeInput) {
    setIsSaving(true)
    try {
      const res = await fetch('/api/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json()
      if (!res.ok || !j.success) throw new Error(j.error || 'Failed')
      router.push('/admin/employees')
    } catch (e) {
      alert(String(e))
    } finally { setIsSaving(false) }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Workforce roster"
          title="Add Worker"
          description="Register a new employee with login credentials and role assignment."
          action={
            <Link href="/admin/employees">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          }
        />

        <SectionCard title="Worker details" description="Basic profile and access information">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Full name">
              <Input {...register('name')} placeholder="Enter full name" />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </FormField>

            <FormField label="Phone">
              <Input {...register('phone')} placeholder="+91 98765 43210" />
            </FormField>

            <FormField label="Email">
              <Input type="email" {...register('email')} placeholder="worker@company.com" />
            </FormField>

            <FormField label="PIN" description="4-digit login PIN for the mobile app">
              <Input {...register('pin')} placeholder="••••" />
            </FormField>

            <FormField label="Role">
              <Select {...register('role')}>
                <option value="WORKER">Worker</option>
                <option value="SUPERVISOR">Supervisor</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super admin</option>
              </Select>
            </FormField>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Create Worker'}
              </Button>
              <Link href="/admin/employees">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageShell>
  )
}
