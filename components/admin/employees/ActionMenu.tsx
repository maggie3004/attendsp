'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MoreHorizontal, Eye, Edit2, UserCheck, UserX, Clock } from 'lucide-react'

interface Props {
  onView: () => void
  onEdit: () => void
  onFace: () => void
  onHistory: () => void
  onDisable: () => void
}

export function ActionMenu({ onView, onEdit, onFace, onHistory, onDisable }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute right-0 z-[100] mt-2 w-44 origin-top-right rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <button onClick={() => { setIsOpen(false); onView(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><Eye className="h-4 w-4 text-slate-400"/> View</button>
            <button onClick={() => { setIsOpen(false); onEdit(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><Edit2 className="h-4 w-4 text-slate-400"/> Edit</button>
            <button onClick={() => { setIsOpen(false); onFace(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><UserCheck className="h-4 w-4 text-slate-400"/> Register Face</button>
            <button onClick={() => { setIsOpen(false); onHistory(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"><Clock className="h-4 w-4 text-slate-400"/> Attendance</button>
            <div className="border-t border-slate-100 my-1" />
            <button onClick={() => { setIsOpen(false); onDisable(); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"><UserX className="h-4 w-4 text-rose-500"/> Disable</button>
          </div>
        </div>
      )}
    </div>
  )
}
