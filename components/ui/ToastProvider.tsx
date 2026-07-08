'use client'

import React, {createContext, useContext, useState, useCallback} from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Toast = { id: string; title: string; description?: string; tone?: 'info'|'success'|'warning'|'danger' }

const ToastContext = createContext<{ push: (t: Omit<Toast,'id'>) => void } | null>(null)

export function useToasts(){
  const ctx = useContext(ToastContext)
  if(!ctx) throw new Error('useToasts must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }){
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((t: Omit<Toast,'id'>) => {
    const id = Math.random().toString(36).slice(2,9)
    setToasts(prev => [...prev, { id, ...t }])
    setTimeout(() => setToasts(prev => prev.filter(x=>x.id!==id)), 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="pointer-events-auto">
              <div className={`rounded-xl p-3 shadow-lg border ${t.tone==='success'? 'bg-emerald-50 border-emerald-200': t.tone==='warning'? 'bg-amber-50 border-amber-200': t.tone==='danger'? 'bg-rose-50 border-rose-200': 'bg-white border-slate-200'}`}>
                <div className="font-semibold text-sm text-slate-900">{t.title}</div>
                {t.description && <div className="text-sm text-slate-500 mt-1">{t.description}</div>}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
