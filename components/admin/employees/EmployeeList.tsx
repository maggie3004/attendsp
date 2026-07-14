'use client'

import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { EmptyState } from '@/components/ui/DesignSystem'
import { FaceRegistrationWizard } from '@/components/worker/FaceRegistrationWizard'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Form'
import { ActionMenu } from './ActionMenu'
import { ArrowDownUp, ChevronRight, ChevronDown, Search, Plus, Columns } from 'lucide-react'
import { format } from 'date-fns'

// ── Types ─────────────────────────────────────────────────────────
interface Employee {
  id: string
  employeeId: string
  name: string
  phone: string | null
  email: string | null
  role: string
  isActive: boolean
  createdAt: string
  designation: string | null
  department: string | null
  profileImageUrl: string | null
  faceRegisteredAt: string | null
  employee: {
    siteAssignments: { site: { id: string; name: string; code: string }; isPrimary: boolean }[]
  } | null
}

type SortConfig = { key: string; direction: 'asc' | 'desc' }
type ColumnConfig = Record<string, boolean>

const DEFAULT_COLUMNS: ColumnConfig = {
  contact: true,
  site: true,
  role: true,
  status: true,
  joinDate: true,
  face: false,
}

interface GridState {
  activeView: string
  density: 'compact' | 'comfortable' | 'expanded'
  siteFilter: string
  roleFilter: string
  statusFilter: string
  sortConfigs: SortConfig[]
  columns: ColumnConfig
}

const DEFAULT_STATE: GridState = {
  activeView: 'all',
  density: 'compact',
  siteFilter: '',
  roleFilter: '',
  statusFilter: '',
  sortConfigs: [],
  columns: DEFAULT_COLUMNS,
}

interface WorkforceSummary {
  totalWorkers: number
  supervisors: number
  presentToday: number | null
  absentToday: number | null
}

// ── Memoized Card Component ─────────────────────────────────────────
const EmployeeCard = memo(({
  emp,
  isSelected,
  onToggleSelect,
  onEdit,
  onFace,
  onHistory,
  onDisable,
}: {
  emp: Employee
  isSelected: boolean
  onToggleSelect: (id: string) => void
  onEdit: (id: string) => void
  onFace: (id: string) => void
  onHistory: (id: string) => void
  onDisable: (id: string) => void
}) => {
  return (
    <div className={cn(
      "group relative flex flex-col justify-between rounded-[1.5rem] border bg-white p-6 shadow-sm transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]",
      isSelected ? "border-brand ring-1 ring-brand bg-blue-50/10" : "border-slate-200/60"
    )}>
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
        <ActionMenu
          onView={() => onEdit(emp.id)}
          onEdit={() => onEdit(emp.id)}
          onFace={() => onFace(emp.id)}
          onHistory={() => onHistory(emp.id)}
          onDisable={() => onDisable(emp.id)}
        />
        <input 
          type="checkbox" 
          className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand cursor-pointer" 
          checked={isSelected}
          onChange={() => onToggleSelect(emp.id)}
        />
      </div>

      <div className="flex flex-col items-center text-center">
        {emp.profileImageUrl ? (
          <img src={emp.profileImageUrl} alt="" className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-50 shadow-sm mb-4" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand/10 text-2xl font-bold text-brand ring-4 ring-slate-50 shadow-sm mb-4">
            {emp.name.charAt(0)}
          </div>
        )}
        <h3 className="text-lg font-bold text-slate-900">{emp.name}</h3>
        <p className="text-[13px] font-medium text-slate-500 mb-1">{emp.designation || 'Worker'} • {emp.employeeId}</p>
        
        <span className={cn(
          "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold tracking-wide uppercase",
          emp.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
        )}>
          <span className={cn("h-1.5 w-1.5 rounded-full", emp.isActive ? "bg-emerald-500" : "bg-red-500")} />
          {emp.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2 rounded-xl bg-slate-50 p-4 text-[13px]">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Contact</span>
          <span className="text-slate-900 font-semibold">{emp.phone || emp.email || '—'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Site</span>
          <span className="text-slate-900 font-semibold truncate max-w-[140px]">{emp.employee?.siteAssignments[0]?.site.name || 'Unassigned'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Face Scan</span>
          <span className={cn("font-semibold", emp.faceRegisteredAt ? "text-emerald-600" : "text-amber-600")}>
            {emp.faceRegisteredAt ? 'Registered' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  )
})
EmployeeCard.displayName = 'EmployeeCard'

// ── Main Component ────────────────────────────────────────────────
export function EmployeeList() {
  const router = useRouter()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [total, setTotal] = useState(0)
  const [sites, setSites] = useState<{id:string;name:string}[]>([])
  const [summary, setSummary] = useState<WorkforceSummary | null>(null)
  
  // Grid State
  const [gridState, setGridState] = useState<GridState>(DEFAULT_STATE)
  const [showColPicker, setShowColPicker] = useState(false)
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')
  
  // Loading & Modal State
  const [isLoading, setIsLoading] = useState(true)
  const [showFaceWizardId, setShowFaceWizardId] = useState<string | null>(null)

  // ── Initialization & Persistence ────────────────────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem('attendsp_grid_state')
      if (stored) {
        setGridState(prev => ({ ...prev, ...JSON.parse(stored) }))
      }
    } catch (e) {}
    
    let mounted = true
    ;(async () => {
      try {
        const [sitesRes, summaryRes] = await Promise.all([
          fetch('/api/sites'),
          fetch('/api/workforce-summary')
        ])
        const sitesData = await sitesRes.json()
        const summaryData = await summaryRes.json()
        
        if (mounted) {
          setSites((sitesData.data || []).map((s: any) => ({ id: s.id, name: s.name })))
          if (summaryData.success) {
            setSummary(summaryData.data)
          }
        }
      } catch (e) {}
    })()
    return () => { mounted = false }
  }, [])

  const updateGridState = useCallback((updates: Partial<GridState>) => {
    setGridState(prev => {
      const next = { ...prev, ...updates }
      localStorage.setItem('attendsp_grid_state', JSON.stringify(next))
      return next
    })
  }, [])

  // ── Fetching ────────────────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ 
        search, 
        page: '1', 
        pageSize: '50', 
        siteId: gridState.siteFilter, 
        status: gridState.statusFilter, 
        role: gridState.roleFilter 
      })
      const res = await fetch(`/api/employees?${params}`)
      const data = await res.json()
      setEmployees(data.data ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setIsLoading(false)
    }
  }, [search, gridState.siteFilter, gridState.statusFilter, gridState.roleFilter])

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300)
    return () => clearTimeout(timer)
  }, [fetchEmployees])

  // ── Handlers ────────────────────────────────────────────────────
  const handleViewChange = useCallback((view: string) => {
    if (view === 'all') updateGridState({ activeView: view, siteFilter: '', roleFilter: '', statusFilter: '' })
    else if (view === 'supervisors') updateGridState({ activeView: view, roleFilter: 'SUPERVISOR', siteFilter: '', statusFilter: '' })
    else updateGridState({ activeView: view, siteFilter: '', roleFilter: '', statusFilter: '' })
  }, [updateGridState])

  const toggleSelect = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleSelectAll = useCallback(() => {
    if (selected.size === employees.length && employees.length > 0) setSelected(new Set())
    else setSelected(new Set(employees.map(e => e.id)))
  }, [employees, selected.size])

  const toggleExpand = useCallback((id: string) => {
    setExpandedRows(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSort = useCallback((key: string, isShift: boolean) => {
    setGridState(prev => {
      const prevSorts = prev.sortConfigs || []
      const existingIdx = prevSorts.findIndex(c => c.key === key)
      let nextSorts = [...prevSorts]
      
      if (!isShift) {
        if (existingIdx >= 0) {
          const dir = prevSorts[existingIdx]?.direction
          nextSorts = dir === 'asc' ? [{ key, direction: 'desc' }] : []
        } else {
          nextSorts = [{ key, direction: 'asc' }]
        }
      } else {
        if (existingIdx >= 0) {
          const dir = prevSorts[existingIdx]?.direction
          if (dir === 'asc') nextSorts[existingIdx] = { key, direction: 'desc' }
          else nextSorts.splice(existingIdx, 1)
        } else {
          nextSorts.push({ key, direction: 'asc' })
        }
      }
      const nextState = { ...prev, sortConfigs: nextSorts }
      localStorage.setItem('attendsp_grid_state', JSON.stringify(nextState))
      return nextState
    })
  }, [])

  // ── Row Actions ─────────────────────────────────────────────────
  const handleEdit = useCallback((id: string) => router.push(`/admin/employees/${id}`), [router])
  const handleFace = useCallback((id: string) => setShowFaceWizardId(id), [])
  const handleHistory = useCallback((id: string) => router.push(`/admin/employees/${id}/history`), [router])
  const handleDisable = useCallback(async (id: string) => {
    if (!confirm('Disable this user?')) return
    try {
      const res = await fetch(`/api/employees/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: false }) })
      const j = await res.json()
      if (res.ok && j.success) fetchEmployees()
    } catch (e) {}
  }, [fetchEmployees])

  // ── Bulk Actions ────────────────────────────────────────────────
  const onAssignSite = useCallback(async (selectedIds: string[]) => {
    console.log('Assign Site:', selectedIds)
  }, [])
  const onNotifyWorkers = useCallback(async (selectedIds: string[]) => {
    console.log('Notify:', selectedIds)
  }, [])
  const onExportWorkers = useCallback(async (selectedIds: string[]) => {
    console.log('Exporting IDs via /api/employees/export', selectedIds)
    // Production architecture: POST /api/employees/export
  }, [])
  const onDeactivateWorkers = useCallback(async (selectedIds: string[]) => {
    if(confirm(`Deactivate ${selectedIds.length} users?`)) {
      setSelected(new Set())
    }
  }, [])

  // ── Derived Data ────────────────────────────────────────────────
  const sortedEmployees = useMemo(() => {
    let sorted = [...employees]
    const configs = gridState.sortConfigs || []
    for (let i = configs.length - 1; i >= 0; i--) {
      const config = configs[i]
      if (!config) continue
      const { key, direction } = config
      sorted.sort((a, b) => {
        let valA: any = a[key as keyof Employee]
        let valB: any = b[key as keyof Employee]
        
        if (key === 'site') {
          valA = a.employee?.siteAssignments[0]?.site.name || ''
          valB = b.employee?.siteAssignments[0]?.site.name || ''
        } else if (key === 'status') {
          valA = a.isActive ? 1 : 0
          valB = b.isActive ? 1 : 0
        }
        
        if (valA < valB) return direction === 'asc' ? -1 : 1
        if (valA > valB) return direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return sorted
  }, [employees, gridState.sortConfigs])

  const densityPadding = gridState.density === 'compact' ? 'py-1.5' : gridState.density === 'comfortable' ? 'py-3' : 'py-4'

  return (
    <div className="space-y-4">
      {/* Workforce Intelligence Strip */}
      <div className="flex flex-wrap items-center gap-6 rounded-xl border border-slate-200/60 bg-white px-6 py-4 shadow-sm text-[13px]">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground-muted">Total Workers</span>
          <span className="font-bold text-foreground">{summary ? summary.totalWorkers : '—'}</span>
        </div>
        <div className="h-4 w-px bg-surface-border" />
        <div className="flex items-center gap-2 text-emerald-700">
          <span className="font-medium">Present Today</span>
          <span className="font-bold">{summary?.presentToday ?? '—'}</span>
        </div>
        <div className="h-4 w-px bg-surface-border" />
        <div className="flex items-center gap-2 text-red-700">
          <span className="font-medium">Absent Today</span>
          <span className="font-bold">{summary?.absentToday ?? '—'}</span>
        </div>
        <div className="h-4 w-px bg-surface-border" />
        <div className="flex items-center gap-2 text-amber-700">
          <span className="font-medium">Supervisors</span>
          <span className="font-bold">{summary ? summary.supervisors : '—'}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-surface-border bg-white shadow-card overflow-hidden">
        {/* Top Header & Tabs */}
        <div className="border-b border-surface-border bg-white">
          <nav className="-mb-px flex gap-6 px-6 overflow-x-auto">
            {[
              { id: 'all', label: 'All Workers' },
              { id: 'present-today', label: 'Present Today' },
              { id: 'absent-today', label: 'Absent Today' },
              { id: 'supervisors', label: 'Supervisors' },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => handleViewChange(view.id)}
                className={cn(
                  'whitespace-nowrap border-b-2 py-3 text-[13px] font-semibold transition-colors',
                  gridState.activeView === view.id
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
                )}
              >
                {view.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Enterprise Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-surface-border bg-slate-50/50 p-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-[13px] focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand shadow-sm"
              />
            </div>
            <Select value={gridState.siteFilter} onChange={(e) => updateGridState({ siteFilter: e.target.value })} className="w-40 py-1.5 text-[13px] h-[34px]">
              <option value="">All Sites</option>
              {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <Select value={gridState.roleFilter} onChange={(e) => updateGridState({ roleFilter: e.target.value })} className="w-32 py-1.5 text-[13px] h-[34px] hidden sm:block">
              <option value="">All Roles</option>
              <option value="WORKER">Worker</option>
              <option value="SUPERVISOR">Supervisor</option>
            </Select>
            <Select value={gridState.statusFilter} onChange={(e) => updateGridState({ statusFilter: e.target.value })} className="w-32 py-1.5 text-[13px] h-[34px] hidden sm:block">
              <option value="">Any Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-slate-500 font-medium">Grid View</span>
          </div>
        </div>

        {/* Enterprise Data Grid */}
        <div className="p-6 bg-slate-50/30 min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1,2,3,4,5,6,7,8].map(i => <SkeletonLoader key={i} rows={4} />)}
            </div>
          ) : employees.length === 0 ? (
             <div className="p-12 bg-white rounded-2xl border border-slate-200/60 shadow-sm"><EmptyState title="No workforce profiles found" description="Adjust your filters or add new workers." primaryLabel="Clear Filters" onPrimary={() => handleViewChange('all')} /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedEmployees.map((emp) => (
                <EmployeeCard
                  key={emp.id}
                  emp={emp}
                  isSelected={selected.has(emp.id)}
                  onToggleSelect={toggleSelect}
                  onEdit={handleEdit}
                  onFace={handleFace}
                  onHistory={handleHistory}
                  onDisable={handleDisable}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-wrap justify-center items-center gap-3 md:gap-5 rounded-2xl bg-[#0f172a] px-4 md:px-6 py-3.5 text-sm font-semibold text-white shadow-2xl animate-in slide-in-from-bottom-6 border border-slate-700/50 w-[90%] md:w-auto">
          <div className="flex items-center gap-2">
            <span className="flex h-6 min-w-[24px] items-center justify-center rounded-md bg-blue-500/20 px-1.5 text-xs text-blue-300 ring-1 ring-blue-500/30">
              {selected.size}
            </span>
            <span className="text-slate-300 whitespace-nowrap hidden sm:inline">workers selected</span>
          </div>
          <div className="h-4 w-px bg-slate-700 hidden sm:block" />
          <button className="text-slate-300 hover:text-white transition-colors" onClick={() => onAssignSite(Array.from(selected))}>Assign</button>
          <button className="text-slate-300 hover:text-white transition-colors" onClick={() => onExportWorkers(Array.from(selected))}>Export</button>
          <button className="text-slate-300 hover:text-white transition-colors" onClick={() => onNotifyWorkers(Array.from(selected))}>Notify</button>
          <button className="text-red-400 hover:text-red-300 transition-colors font-semibold" onClick={() => onDeactivateWorkers(Array.from(selected))}>Deactivate</button>
        </div>
      )}
      
      {showFaceWizardId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-6">
            <FaceRegistrationWizard userId={showFaceWizardId} onClose={() => setShowFaceWizardId(null)} />
          </div>
        </div>
      )}
    </div>
  )
}
