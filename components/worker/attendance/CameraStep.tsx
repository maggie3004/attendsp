'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, RotateCcw, Loader2, AlertCircle } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'

export function CameraStep() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { setStep, setCapturedImage } = useAttendanceStore()
  const [status, setStatus] = useState<'starting' | 'ready' | 'capturing' | 'error'>('starting')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const startCamera = useCallback(async () => {
    setStatus('starting')
    streamRef.current?.getTracks().forEach((t) => t.stop())

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStatus('ready')
      }
    } catch (err) {
      const msg =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access and try again.'
          : 'Camera not available. Please check your device settings.'
      setErrorMsg(msg)
      setStatus('error')
    }
  }, [facingMode])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startCamera])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || status !== 'ready') return
    setStatus('capturing')

    const canvas = canvasRef.current
    const video = videoRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')!
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImage(imageData)

    streamRef.current?.getTracks().forEach((t) => t.stop())
    setStep('verifying')
  }, [status, facingMode, setCapturedImage, setStep])

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 text-xs font-bold text-emerald-700">✓</div>
        <div className="h-px w-8 bg-slate-200" />
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</div>
        <span>Capture your face</span>
      </div>

      <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-50 shadow-sm">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          style={{ transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Face guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-52 h-52 rounded-full border-2 border-white/60 border-dashed" />
          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-indigo-500 rounded-br-lg" />
        </div>

        {/* Loading overlay */}
        {status === 'starting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-slate-500">Starting camera...</p>
          </div>
        )}

        {/* Error overlay */}
        {status === 'error' && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="text-sm font-medium text-slate-600">{errorMsg}</p>
            <button onClick={startCamera} className="mt-2 rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Guide text */}
      <p className="text-center text-sm font-medium text-slate-500">
        Position your face inside the guide and keep your lighting clear.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Flip camera */}
        <button onClick={() => setFacingMode((m) => (m === 'user' ? 'environment' : 'user'))} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-500 shadow-sm transition hover:text-slate-900">
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Capture button */}
        <motion.button whileTap={{ scale: 0.95 }} onClick={captureImage} disabled={status !== 'ready'} className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-sm transition hover:scale-105 disabled:opacity-40">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <Camera className="h-7 w-7 text-white" />
          </div>
        </motion.button>

        {/* Spacer */}
        <div className="w-11 h-11" />
      </div>
    </div>
  )
}
