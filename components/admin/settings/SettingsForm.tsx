'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Loader2, Save, Clock, MapPin, ScanFace, Wifi, Building } from 'lucide-react'
import { updateSettingsSchema, type UpdateSettingsInput } from '@/lib/validations'

interface Props {
  settings: {
    defaultStartTime: string
    defaultEndTime: string
    defaultLateThresholdMins: number
    defaultHalfDayThresholdMins: number
    defaultAbsentThresholdMins: number
    defaultGeofenceRadius: number
    faceConfidenceThreshold: number
    gpsAccuracyThreshold: number
    companyName: string
    timezone: string
    offlineSyncEnabled: boolean
  }
}

function SettingSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200/80 bg-white p-6 space-y-4 shadow-sm">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          <Icon className="w-4 h-4" />
        </div>
        <h2 className="font-semibold text-sm text-slate-900">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {hint && <div className="text-xs text-slate-500 mt-0.5">{hint}</div>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

export function SettingsForm({ settings }: Props) {
  const [saved, setSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { register, handleSubmit } = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: settings as UpdateSettingsInput,
  })

  async function onSubmit(data: UpdateSettingsInput) {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const j = await res.json()
      if (!res.ok || !j.success) {
        alert(j.error || 'Failed to save settings')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (e) {
      alert('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass = "bg-white border border-slate-200 rounded-[1rem] px-3 py-3 text-sm text-slate-900 w-32 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-right"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <SettingSection title="Company Info" icon={Building}>
        <Field label="Company Name">
          <input {...register('companyName')} className={inputClass} style={{ width: 200 }} />
        </Field>
        <Field label="Timezone">
          <input {...register('timezone')} className={inputClass} style={{ width: 200 }} />
        </Field>
      </SettingSection>

      <SettingSection title="Attendance Timings" icon={Clock}>
        <Field label="Work Start Time" hint="Default start time for all sites">
          <input type="time" {...register('defaultStartTime')} className={inputClass} />
        </Field>
        <Field label="Work End Time">
          <input type="time" {...register('defaultEndTime')} className={inputClass} />
        </Field>
        <Field label="Late Threshold" hint="Minutes after start time before marking Late">
          <div className="flex items-center gap-1.5">
            <input type="number" {...register('defaultLateThresholdMins', { valueAsNumber: true })} className={inputClass} />
            <span className="text-xs text-slate-500">min</span>
          </div>
        </Field>
        <Field label="Half Day Threshold" hint="Minutes for Half Day rule">
          <div className="flex items-center gap-1.5">
            <input type="number" {...register('defaultHalfDayThresholdMins', { valueAsNumber: true })} className={inputClass} />
            <span className="text-xs text-slate-500">min</span>
          </div>
        </Field>
      </SettingSection>

      <SettingSection title="GPS Settings" icon={MapPin}>
        <Field label="Default Geofence Radius" hint="Default radius in meters for new sites">
          <div className="flex items-center gap-1.5">
            <input type="number" {...register('defaultGeofenceRadius', { valueAsNumber: true })} className={inputClass} />
            <span className="text-xs text-slate-500">m</span>
          </div>
        </Field>
        <Field label="GPS Accuracy Threshold" hint="Maximum acceptable GPS inaccuracy">
          <div className="flex items-center gap-1.5">
            <input type="number" {...register('gpsAccuracyThreshold', { valueAsNumber: true })} className={inputClass} />
            <span className="text-xs text-slate-500">m</span>
          </div>
        </Field>
      </SettingSection>

      <SettingSection title="Face Recognition" icon={ScanFace}>
        <Field label="Confidence Threshold" hint="Minimum confidence score (0.0 – 1.0)">
          <input type="number" step="0.05" min="0.3" max="0.99" {...register('faceConfidenceThreshold', { valueAsNumber: true })} className={inputClass} />
        </Field>
      </SettingSection>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-[1rem] bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && <span className="text-sm text-emerald-600">✓ Settings saved!</span>}
      </div>
    </form>
  )
}
