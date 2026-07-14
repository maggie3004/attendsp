'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSiteSchema, type CreateSiteInput } from '@/lib/validations'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PageShell } from '@/components/ui/Layout'
import { PageHeader, SectionCard } from '@/components/ui/DesignSystem'
import { FormField, Input } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'

export default function NewSitePage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CreateSiteInput>({ resolver: zodResolver(createSiteSchema) })

  async function onSubmit(data: CreateSiteInput) {
    setIsSaving(true)
    try {
      const res = await fetch('/api/sites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json()
      if (!res.ok || !j.success) throw new Error(j.error || 'Failed')
      router.push('/admin/sites')
    } catch (e) {
      alert(String(e))
    } finally { setIsSaving(false) }
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
        <PageHeader
          eyebrow="Site management"
          title="Add Site"
          description="Register a new work location with geofence coordinates."
          action={
            <Link href="/admin/sites">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          }
        />

        <SectionCard title="Site details" description="Location and geofence configuration">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Name">
              <Input {...register('name')} placeholder="e.g. Mumbai HQ" />
              {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
            </FormField>

            <FormField label="Address">
              <Input {...register('address')} placeholder="Full street address" />
            </FormField>

            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Latitude">
                <Input type="number" step="0.000001" {...register('latitude', { valueAsNumber: true })} placeholder="19.0760" />
              </FormField>
              <FormField label="Longitude">
                <Input type="number" step="0.000001" {...register('longitude', { valueAsNumber: true })} placeholder="72.8777" />
              </FormField>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" disabled={isSaving}>
                {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : 'Create Site'}
              </Button>
              <Link href="/admin/sites">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>
          </form>
        </SectionCard>
      </div>
    </PageShell>
  )
}
