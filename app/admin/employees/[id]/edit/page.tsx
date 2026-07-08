'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateEmployeeSchema, type UpdateEmployeeInput } from '@/lib/validations'
import { Loader2 } from 'lucide-react'

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateEmployeeInput>({ resolver: zodResolver(updateEmployeeSchema) })

  async function onSubmit(data: UpdateEmployeeInput) {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/employees/${params.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json()
      if (!res.ok || !j.success) throw new Error(j.error || 'Failed')
      router.push(`/admin/employees/${params.id}`)
    } catch (e) {
      alert(String(e))
    } finally { setIsSaving(false) }
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-3">Edit Worker</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-3">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input {...register('name')} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input {...register('phone')} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register('email')} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <button type="submit" disabled={isSaving} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
