'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, RotateCcw, Loader2, AlertCircle } from 'lucide-react'
import { useAttendanceStore } from '@/store/attendanceStore'

export function CameraStep() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const { setStep, setCapturedImage, setError } = useAttendanceStore()
  const [status, setStatus] = useState<'starting' | 'ready' | 'capturing' | 'error'>('starting')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const startCamera = useCallback(async () => {
    setStatus('starting')
    // Stop any existing stream
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
    // Mirror for front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.85)
    setCapturedImage(imageData)

    // Stop camera
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setStep('verifying')
  }, [status, facingMode, setCapturedImage, setStep])

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs text-foreground/40">
        <div className="w-5 h-5 rounded-full bg-surface-border flex items-center justify-center text-white font-bold text-xs">1</div>
        <div className="w-8 h-px bg-surface-border" />
        <div className="w-5 h-5 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs">2</div>
        <span>Capture Face</span>
      </div>

      {/* Camera viewfinder */}
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-surface-elevated border border-surface-border">
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
          <div className="w-52 h-52 rounded-full border-2 border-white/20 border-dashed" />
          {/* Corner brackets */}
          <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-brand rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-8 h-8 border-t-2 border-r-2 border-brand rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-8 h-8 border-b-2 border-l-2 border-brand rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-brand rounded-br-lg" />
        </div>

        {/* Loading overlay */}
        {status === 'starting' && (
          <div className="absolute inset-0 bg-surface-elevated/80 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-brand animate-spin" />
            <p className="text-sm text-foreground/60">Starting camera...</p>
          </div>
        )}

        {/* Error overlay */}
        {status === 'error' && (
          <div className="absolute inset-0 bg-surface-elevated flex flex-col items-center justify-center gap-3 p-6">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-sm text-center text-foreground/60">{errorMsg}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 rounded-xl bg-brand text-white text-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Guide text */}
      <p className="text-xs text-foreground/40 text-center">
        Position your face inside the circle. Ensure good lighting.
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Flip camera */}
        <button
          onClick={() => setFacingMode(m => m === 'user' ? 'environment' : 'user')}
          className="p-3 rounded-2xl bg-surface-elevated border border-surface-border text-foreground/50 hover:text-foreground transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        {/* Capture button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={captureImage}
          disabled={status !== 'ready'}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center disabled:opacity-40 shadow-lg hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center">
            <Camera className="w-7 h-7 text-white" />
          </div>
        </motion.button>

        {/* Spacer */}
        <div className="w-11 h-11" />
      </div>
    </div>
  )
}
