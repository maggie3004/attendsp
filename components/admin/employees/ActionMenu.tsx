'use client'

import React from 'react'
import { MoreHorizontal, Eye, Edit2, UserCheck, UserX, Clock } from 'lucide-react'

interface Props {
  onView: () => void
  onEdit: () => void
  onFace: () => void
  onHistory: () => void
  onDisable: () => void
}

export function ActionMenu({ onView, onEdit, onFace, onHistory, onDisable }: Props) {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <div className="absolute right-0 z-10 mt-2 w-44 origin-top-right rounded-lg border border-slate-200 bg-white shadow-lg">
        <div className="py-1">
          <button onClick={onView} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Eye className="h-4 w-4 text-slate-500"/> View</button>
          <button onClick={onEdit} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Edit2 className="h-4 w-4 text-slate-500"/> Edit</button>
          <button onClick={onFace} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><UserCheck className="h-4 w-4 text-slate-500"/> Register Face</button>
          <button onClick={onHistory} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"><Clock className="h-4 w-4 text-slate-500"/> Attendance</button>
          <div className="border-t border-slate-100" />
          <button onClick={onDisable} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-slate-50"><UserX className="h-4 w-4 text-rose-500"/> Disable</button>
        </div>
      </div>
    </div>
  )
}
