'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createSiteSchema, type CreateSiteInput } from '@/lib/validations'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-3">Add Site</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input {...register('name')} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Address</label>
          <input {...register('address')} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Latitude</label>
          <input type="number" step="0.000001" {...register('latitude', { valueAsNumber: true })} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitude</label>
          <input type="number" step="0.000001" {...register('longitude', { valueAsNumber: true })} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <button type="submit" disabled={isSaving} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : 'Create Site'}
          </button>
        </div>
      </form>
    </div>
  )
}
