import React from 'react'
import { Users } from 'lucide-react'

interface Props {
  title?: string
  description?: string
  onAdd?: () => void
  onImport?: () => void
}

export function EmptyState({ title = 'No workforce profiles found', description = 'Try adding workers or import a CSV to get started.', onAdd, onImport }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="rounded-full bg-slate-50 p-4">
        <Users className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
      <div className="mt-3 flex gap-2">
        <button onClick={onAdd} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Add Worker</button>
        <button onClick={onImport} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700">Import CSV</button>
      </div>
    </div>
  )
}
