'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, Loader2, ShieldCheck, Globe, ChevronDown,
  User, Lock, ArrowRight, MapPin, RefreshCw, Scan, Check, ScanFace
} from 'lucide-react'
import { loginSchema, type LoginInput } from '@/lib/validations'
import { cn } from '@/lib/utils'
import { useToasts } from '@/components/ui/ToastProvider'

/* ── Tiny dot-grid decoration ──────────────────────────────── */
function DotGrid({ cols = 7, rows = 5, className }: { cols?: number; rows?: number; className?: string }) {
  return (
    <div
      className={cn('pointer-events-none select-none', className)}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '9px' }}
    >
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} style={{ height: 3, width: 3, borderRadius: '50%', background: 'rgba(147,197,253,0.22)' }} />
      ))}
    </div>
  )
}

/* ── Feature row ────────────────────────────────────────────── */
function Feature({
  icon, iconBg, title, desc,
}: { icon: React.ReactNode; iconBg: string; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex h-[46px] w-[46px] flex-shrink-0 items-center justify-center rounded-2xl"
        style={{ background: iconBg, border: '1px solid rgba(255,255,255,0.06)' }}
      >
        {icon}
      </div>
      <div>
        <p className="text-[0.88rem] font-semibold text-white">{title}</p>
        <p className="mt-[2px] text-[0.76rem] leading-snug" style={{ color: 'rgba(147,170,220,0.65)' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const { push: pushToast } = useToasts()
  const [showPin, setShowPin] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isFaceScanning, setIsFaceScanning] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  // Load remembered Employee ID on mount
  useEffect(() => {
    const saved = localStorage.getItem('attendsp_remember_employee_id')
    if (saved) {
      setValue('employeeId', saved)
      setRememberMe(true)
    }
  }, [setValue])

  async function onSubmit(data: LoginInput) {
    setIsLoading(true)
    setServerError(null)

    if (rememberMe) {
      localStorage.setItem('attendsp_remember_employee_id', data.employeeId)
    } else {
      localStorage.removeItem('attendsp_remember_employee_id')
    }
    try {
      const result = await signIn('credentials', {
        employeeId: data.employeeId,
        pin: data.pin,
        redirect: false,
      })
      if (result?.error) {
        setServerError('Invalid Employee ID or PIN. Please try again.')
      } else {
        const res = await fetch('/api/auth/session')
        const session = await res.json()
        router.push(session?.user?.role === 'WORKER' ? '/worker/attendance' : '/admin/dashboard')
      }
    } catch {
      setServerError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleFaceIdSignIn() {
    setIsFaceScanning(true)
    
    // Simulate biometric scan delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // For demo purposes, mock a successful face match with the Admin account
    setValue('employeeId', 'ADMIN-001')
    setValue('pin', '1234')
    
    setIsFaceScanning(false)
    onSubmit({ employeeId: 'ADMIN-001', pin: '1234' })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>

      {/* ══════════════════════════════════════════════════
          LEFT  —  dark navy  (50 %)
      ══════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-1/2"
        style={{
          position: 'relative',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #07102A 0%, #0B1D56 60%, #060E28 100%)',
        }}
      >
        {/* bottom-left glow */}
        <div style={{
          position: 'absolute', bottom: -100, left: -80,
          width: 440, height: 440, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,78,216,0.35) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />
        {/* top-right faint glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        {/* dot grids */}
        <DotGrid className="absolute top-8 right-8"    cols={7} rows={5} />
        <DotGrid className="absolute bottom-14 right-8" cols={7} rows={5} />

        {/* ── LOGO (top) ── */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', gap: 12, padding: '44px 56px 0' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: 44, width: 44, borderRadius: 14,
            background: '#2563EB',
            boxShadow: '0 8px 24px rgba(37,99,235,0.45)',
          }}>
            <ShieldCheck size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
            AttendSP
          </span>
        </div>

        {/* ── HERO + FEATURES (centre, grows) ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 56px',
        }}>
          {/* Eyebrow */}
          <p style={{
            fontSize: '0.66rem', fontWeight: 700, letterSpacing: '0.24em',
            textTransform: 'uppercase', color: 'rgba(96,165,250,0.6)',
            marginBottom: 20,
          }}>
            Enterprise Platform
          </p>

          {/* Big heading */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 3.2vw, 3.1rem)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            color: '#fff',
            margin: 0,
          }}>
            Enterprise<br />
            Workforce<br />
            <span style={{ color: '#60A5FA' }}>Management</span>
          </h1>

          {/* Accent bar */}
          <div style={{
            marginTop: 22, height: 3, width: 48,
            borderRadius: 99, background: '#3B82F6',
          }} />

          {/* Subtitle */}
          <p style={{
            marginTop: 22,
            fontSize: '0.87rem',
            lineHeight: 1.7,
            color: 'rgba(148,170,220,0.72)',
            maxWidth: 280,
          }}>
            Real-time attendance, GPS geofencing,<br />
            and face recognition — all in one platform.
          </p>

          {/* Features */}
          <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 22 }}>
            <Feature
              iconBg="rgba(37,99,235,0.22)"
              icon={<MapPin size={18} color="#60A5FA" strokeWidth={2.5} />}
              title="GPS-Verified Check-In"
              desc="Workers check in only within site boundaries"
            />
            <Feature
              iconBg="rgba(124,58,237,0.22)"
              icon={<Scan size={18} color="#A78BFA" strokeWidth={2.5} />}
              title="Face Recognition"
              desc="Secure biometric verification at every entry"
            />
            <Feature
              iconBg="rgba(5,150,105,0.22)"
              icon={<RefreshCw size={18} color="#34D399" strokeWidth={2.5} />}
              title="Live Sync"
              desc="Attendance updates in real-time across all sites"
            />
          </div>
        </div>

        {/* ── TRUST BADGE (bottom) ── */}
        <div style={{
          position: 'relative', zIndex: 10,
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 56px 44px',
        }}>
          <ShieldCheck size={15} color="rgba(147,197,253,0.45)" strokeWidth={2} />
          <span style={{ fontSize: '0.76rem', color: 'rgba(147,197,253,0.45)' }}>
            Trusted by 500+ organizations across 20+ industries
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          RIGHT  —  pure white  (50 %)
      ══════════════════════════════════════════════════ */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        background: '#fff',
      }}>
        {/* Language pill */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '28px 36px 0' }}>
          <button
            type="button"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              border: '1px solid #E2E8F0', borderRadius: 12,
              padding: '7px 14px',
              fontSize: '0.8rem', fontWeight: 500, color: '#64748B',
              background: '#fff', cursor: 'pointer',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <Globe size={13} />
            English
            <ChevronDown size={11} style={{ color: '#94A3B8' }} />
          </button>
        </div>

        {/* Centred form */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px 40px 40px',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{ width: '100%', maxWidth: 440 }}
          >
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600">
                <ShieldCheck size={20} color="#fff" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.15rem', color: '#0F172A' }}>AttendSP</span>
            </div>

            {/* Heading */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: '1.9rem', fontWeight: 800,
                letterSpacing: '-0.025em', color: '#0F172A',
                margin: 0,
              }}>
                Welcome back!
              </h2>
              <p style={{ marginTop: 8, fontSize: '0.88rem', color: '#64748B' }}>
                Sign in to your workspace
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* Employee ID */}
              <div>
                <label
                  htmlFor="employeeId"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}
                >
                  Employee ID
                </label>
                <div
                  className={cn(
                    'group flex h-[54px] w-full items-center overflow-hidden rounded-2xl border bg-white transition-all',
                    errors.employeeId
                      ? 'border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/15'
                      : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/12'
                  )}
                >
                  <div className="flex h-full w-[50px] flex-shrink-0 items-center justify-center border-r border-slate-100">
                    <User size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="employeeId"
                    type="text"
                    placeholder="ADMIN-001"
                    autoComplete="username"
                    autoFocus
                    {...register('employeeId')}
                    style={{
                      flex: 1, height: '100%', background: 'transparent',
                      padding: '0 16px', fontSize: '0.9rem', color: '#0F172A',
                      outline: 'none', border: 'none',
                    }}
                  />
                </div>
                {errors.employeeId && <p style={{ marginTop: 5, fontSize: '0.74rem', color: '#EF4444' }}>{errors.employeeId.message}</p>}
              </div>

              {/* PIN */}
              <div>
                <label
                  htmlFor="pin"
                  style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: 7 }}
                >
                  PIN
                </label>
                <div
                  className={cn(
                    'group flex h-[54px] w-full items-center overflow-hidden rounded-2xl border bg-white transition-all',
                    errors.pin
                      ? 'border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-400/15'
                      : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/12'
                  )}
                >
                  <div className="flex h-full w-[50px] flex-shrink-0 items-center justify-center border-r border-slate-100">
                    <Lock size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    id="pin"
                    type={showPin ? 'text' : 'password'}
                    placeholder="••••"
                    autoComplete="current-password"
                    inputMode="numeric"
                    maxLength={6}
                    {...register('pin')}
                    style={{
                      flex: 1, height: '100%', background: 'transparent',
                      padding: '0 16px', fontSize: '0.9rem', color: '#0F172A',
                      letterSpacing: '0.12em', outline: 'none', border: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(v => !v)}
                    aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      paddingRight: 16, height: '100%',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      color: '#94A3B8',
                    }}
                  >
                    {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.pin && <p style={{ marginTop: 5, fontSize: '0.74rem', color: '#EF4444' }}>{errors.pin.message}</p>}
              </div>

              {/* Remember me + Forgot PIN */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', userSelect: 'none' }}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe(v => !v)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      height: 18, width: 18, borderRadius: 5, flexShrink: 0,
                      border: rememberMe ? '2px solid #2563EB' : '2px solid #CBD5E1',
                      background: rememberMe ? '#2563EB' : '#fff',
                      transition: 'all 0.15s', cursor: 'pointer',
                    }}
                  >
                    {rememberMe && <Check size={11} color="#fff" strokeWidth={3.5} />}
                  </button>
                  <span style={{ fontSize: '0.83rem', color: '#4B5563' }}>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => pushToast({ title: 'Contact Administrator', description: 'Please contact your HR admin to reset your PIN.', tone: 'info' })}
                  style={{
                    fontSize: '0.83rem', fontWeight: 600, color: '#2563EB',
                    background: 'transparent', border: 'none', cursor: 'pointer',
                  }}
                >
                  Forgot PIN?
                </button>
              </div>

              {/* Server error */}
              <AnimatePresence>
                {serverError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      borderRadius: 16, border: '1px solid #FCA5A5',
                      background: '#FEF2F2', padding: '12px 16px',
                      fontSize: '0.84rem', color: '#DC2626',
                    }}>
                      {serverError}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign In */}
              <button
                type="submit"
                disabled={isLoading}
                className="group"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  height: 54, width: '100%', borderRadius: 16,
                  background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                  boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
                  border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontSize: '0.95rem', fontWeight: 700, color: '#fff',
                  opacity: isLoading ? 0.65 : 1,
                  transition: 'box-shadow 0.2s, opacity 0.2s',
                  marginTop: 4,
                }}
              >
                {isLoading ? (
                  <><Loader2 size={18} className="animate-spin" /> Signing in…</>
                ) : (
                  <><span>Sign In</span><ArrowRight size={17} /></>
                )}
              </button>

              {/* OR */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
                <span style={{ fontSize: '0.76rem', fontWeight: 500, color: '#94A3B8' }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
              </div>

              {/* Face ID */}
              <button
                type="button"
                onClick={handleFaceIdSignIn}
                disabled={isLoading || isFaceScanning}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  height: 54, width: '100%', borderRadius: 16,
                  border: '1.5px solid #E2E8F0', background: '#fff',
                  fontSize: '0.9rem', fontWeight: 600, color: '#374151',
                  cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#F8FAFC'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#CBD5E1'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#fff'
                  ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0'
                }}
              >
                <ShieldCheck size={17} color="#64748B" />
                Sign in with Face ID
              </button>
            </form>

            {/* Footer */}
            <div style={{
              marginTop: 32, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6,
            }}>
              <Lock size={12} color="#94A3B8" />
              <p style={{ fontSize: '0.73rem', color: '#94A3B8' }}>
                Secure face + GPS verified attendance&nbsp;•&nbsp;AttendSP
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Face ID Mock Overlay */}
      <AnimatePresence>
        {isFaceScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 20, padding: 40, borderRadius: 32, background: '#fff',
                boxShadow: '0 20px 60px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0',
              }}
            >
              <motion.div
                animate={{ 
                  boxShadow: ['0 0 0 0 rgba(37,99,235,0.2)', '0 0 0 30px rgba(37,99,235,0)', '0 0 0 0 rgba(37,99,235,0)'] 
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  height: 80, width: 80, borderRadius: '50%', background: '#EFF6FF',
                  color: '#2563EB',
                }}
              >
                <ScanFace size={40} strokeWidth={1.5} />
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Face ID</h3>
                <p style={{ marginTop: 6, fontSize: '0.9rem', color: '#64748B' }}>Looking for your face...</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
