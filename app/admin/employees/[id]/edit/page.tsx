'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateEmployeeSchema, type UpdateEmployeeInput } from '@/lib/validations'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, SectionCard } from '@/components/ui/DesignSystem'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

export default function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateEmployeeInput>({ resolver: zodResolver(updateEmployeeSchema) })

  async function onSubmit(data: UpdateEmployeeInput) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json()
      if (!res.ok || !j.success) throw new Error(j.error || 'Failed')
      router.push(`/admin/employees/${id}`)
    } catch (e) {
      alert(String(e))
    } finally { setIsSaving(false) }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Workforce roster"
          title="Edit Worker"
          description="Update profile details and contact information."
          action={
            <Link href={`/admin/employees/${id}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          }
        />

        <SectionCard title="Worker details" description="Changes take effect immediately">
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

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
              </Button>
              <Link href={`/admin/employees/${id}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageShell>
  )
}
