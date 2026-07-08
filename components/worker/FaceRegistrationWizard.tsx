'use client'

import React, { useState } from 'react'
import { Camera, X } from 'lucide-react'
import { useToasts } from '@/components/ui/ToastProvider'

export function FaceRegistrationWizard({ userId, onClose }: { userId: string; onClose?: ()=>void }){
  const [step, setStep] = useState(1)
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const toasts = useToasts()

  const capture = async () => {
    // placeholder: in real app this would open camera and capture
    setLoading(true)
    await new Promise(r=>setTimeout(r,800))
    setImage('data:image/png;base64,placeholder')
    setLoading(false)
    setStep(2)
  }

  const submit = async () => {
    if (!image) return
    setLoading(true)
    try {
      // Create a 128-length dummy descriptor if real descriptor not available
      const descriptor = new Array(128).fill(0)
      const payload = { faceImage: image, faceDescriptor: descriptor }
      const res = await fetch(`/api/employees/${userId}/face`, { method: 'POST', body: JSON.stringify(payload), headers: { 'content-type': 'application/json' } })
      const json = await res.json()
      if (!res.ok || !json.success) {
        toasts.push({ title: 'Upload failed', description: json.error ?? 'Could not register face', tone: 'danger' })
        return
      }
      toasts.push({ title: 'Face registered', description: 'Face data uploaded successfully', tone: 'success' })
      setStep(3)
      setTimeout(()=> onClose && onClose(), 800)
    } catch (e){
      toasts.push({ title: 'Upload failed', description: 'Could not register face', tone: 'danger' })
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-4 p-4 w-full max-w-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Register face</h3>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-50"><X className="w-4 h-4"/></button>
      </div>

      {step===1 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">Position the worker in the camera frame and capture a clear frontal photo.</p>
          <div className="h-44 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
            <Camera className="w-10 h-10 text-slate-400" />
          </div>
          <div className="flex gap-2">
            <button onClick={capture} disabled={loading} className="rounded-xl bg-blue-600 px-4 py-2 text-white">Capture</button>
            <button onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2">Cancel</button>
          </div>
        </div>
      )}

      {step===2 && (
        <div className="space-y-3">
          <div className="h-44 rounded-lg border border-slate-200 bg-white flex items-center justify-center">
            {image ? <img src={image} alt="preview" className="h-full object-contain" /> : null}
          </div>
          <div className="flex gap-2">
            <button onClick={submit} disabled={loading} className="rounded-xl bg-emerald-600 px-4 py-2 text-white">Upload</button>
            <button onClick={() => setStep(1)} className="rounded-xl border border-slate-200 px-4 py-2">Retake</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="text-center text-sm text-slate-600">Face registered successfully.</div>
      )}
    </div>
  )
}
