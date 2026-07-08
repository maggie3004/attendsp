'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createEmployeeSchema, type CreateEmployeeInput } from '@/lib/validations'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-3">Add Worker</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-3">
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input {...register('name')} className="w-full rounded-xl border p-2" />
          {errors.name && <div className="text-xs text-rose-500">{errors.name.message}</div>}
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
          <label className="block text-sm font-medium">PIN</label>
          <input {...register('pin')} className="w-full rounded-xl border p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select {...register('role')} className="w-full rounded-xl border p-2">
            <option value="WORKER">Worker</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </select>
        </div>

        <div>
          <button type="submit" disabled={isSaving} className="rounded-xl bg-blue-600 px-4 py-2 text-white">
            {isSaving ? <><Loader2 className="w-4 h-4 animate-spin"/> Saving...</> : 'Create Worker'}
          </button>
        </div>
      </form>
    </div>
  )
}
