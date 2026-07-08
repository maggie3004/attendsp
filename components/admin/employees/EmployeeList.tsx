'use client'

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { StatusBadge, RoleBadge, EmptyState, SearchInput, SectionCard } from '@/components/ui/DesignSystem'
import { FaceRegistrationWizard } from '@/components/worker/FaceRegistrationWizard'
import { FilterBar } from '@/components/ui/FilterBar'
import { ActionMenu } from './ActionMenu'
import { SkeletonLoader } from '@/components/ui/SkeletonLoader'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { TableContainer, Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '@/components/ui/Table'
import { Button } from '@/components/ui/Button'

interface Employee {
  id: string
  employeeId: string
  name: string
  phone: string | null
  email: string | null
  role: string
  isActive: boolean
  designation: string | null
  department: string | null
  profileImageUrl: string | null
  faceRegisteredAt: string | null
  employee: {
    siteAssignments: { site: { id: string; name: string; code: string }; isPrimary: boolean }[]
  } | null
}

export function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [siteFilter, setSiteFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [faceFilter, setFaceFilter] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [page] = useState(1)
  const [sites, setSites] = useState<{id:string;name:string}[]>([])
  const router = useRouter()
  const [showFaceWizardId, setShowFaceWizardId] = useState<string | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{success:number; failed:number; errors:any[]} | null>(null)

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({ search, page: String(page), pageSize: '20', siteId: siteFilter, status: statusFilter, face: faceFilter })
      const res = await fetch(`/api/employees?${params}`)
      const data = await res.json()
      setEmployees(data.data ?? [])
      setTotal(data.total ?? 0)
    } finally {
      setIsLoading(false)
    }
  }, [page, search, siteFilter, statusFilter, faceFilter])

  useEffect(() => {
    // load sites for filter dropdown
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/sites')
        const data = await res.json()
        if (!mounted) return
        setSites((data.data || []).map((s: any) => ({ id: s.id, name: s.name })))
      } catch (e) {
        console.error('Failed to load sites', e)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 300)
    return () => clearTimeout(timer)
  }, [fetchEmployees])

  return (
    <SectionCard title="Employee roster" description="Profiles, site assignments, face status, and account health in one place">
      <div className="space-y-6">
        <FilterBar
          search={search}
          setSearch={setSearch}
          sites={sites}
          siteFilter={siteFilter}
          setSiteFilter={setSiteFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          faceFilter={faceFilter}
          setFaceFilter={setFaceFilter}
          clear={() => { setSearch(''); setSiteFilter(''); setStatusFilter(''); setFaceFilter('') }}
        />

        {isLoading ? (
          <SkeletonLoader rows={6} />
        ) : employees.length === 0 ? (
          <EmptyState title="No workforce profiles yet" description="Add workers manually or import a CSV to begin building the roster." primaryLabel="Add Worker" secondaryLabel="Import CSV" onPrimary={() => router.push('/admin/employees/new')} onSecondary={() => setShowImport(true)} />
        ) : (
          <>
            <div className="space-y-4 md:hidden">
              {employees.map((emp) => (
                <Card key={emp.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{emp.name.charAt(0)}</div>
                      <div>
                        <div className="font-semibold text-slate-900">{emp.name}</div>
                        <div className="text-xs text-slate-500">{emp.employeeId} • {emp.employee?.siteAssignments[0]?.site.code ?? 'Unassigned'}</div>
                      </div>
                    </div>
                    <StatusBadge label={emp.isActive ? 'Active' : 'Inactive'} tone={emp.isActive ? 'success' : 'danger'} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <RoleBadge role={emp.role} />
                    <span className={cn('rounded-full px-2 py-1 text-xs font-semibold', emp.faceRegisteredAt ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')}>{emp.faceRegisteredAt ? 'Registered' : 'Pending'}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/admin/employees/${emp.id}`)}>View</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowFaceWizardId(emp.id)}>Face</Button>
                    <ActionMenu
                      onView={() => router.push(`/admin/employees/${emp.id}`)}
                      onEdit={() => router.push(`/admin/employees/${emp.id}/edit`)}
                      onFace={() => setShowFaceWizardId(emp.id)}
                      onHistory={() => router.push(`/admin/employees/${emp.id}/history`)}
                      onDisable={async () => {
                        if (!confirm('Disable this user?')) return
                        try {
                          const res = await fetch(`/api/employees/${emp.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: false }) })
                          const j = await res.json()
                          if (res.ok && j.success) {
                            setEmployees((prev) => prev.map((u) => (u.id === emp.id ? { ...u, isActive: false } : u)))
                            alert('User disabled')
                          } else {
                            alert(j.error || 'Failed to disable')
                          }
                        } catch (e) {
                          alert('Failed to disable')
                        }
                      }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <TableContainer>
              <Table className="min-w-[920px]">
                <TableHead>
                  <tr>
                    <TableHeaderCell>Worker</TableHeaderCell>
                    <TableHeaderCell>Contact</TableHeaderCell>
                    <TableHeaderCell>Site</TableHeaderCell>
                    <TableHeaderCell>Role</TableHeaderCell>
                    <TableHeaderCell>Face</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </tr>
                </TableHead>
                <TableBody>
                  {employees.map((emp, i) => (
                    <TableRow key={emp.id} className="transition duration-200 hover:bg-slate-50/80">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{emp.name.charAt(0)}</div>
                          <div>
                            <div className="font-semibold text-slate-900">{emp.name}</div>
                            <div className="text-xs text-slate-500">{emp.employeeId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{emp.phone ?? emp.email ?? '—'}</TableCell>
                      <TableCell>
                        {emp.employee?.siteAssignments[0] ? (
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {emp.employee.siteAssignments[0].site.code}
                          </span>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell><RoleBadge role={emp.role} /></TableCell>
                      <TableCell>
                        <span className={cn('text-sm font-medium', emp.faceRegisteredAt ? 'text-emerald-600' : 'text-slate-400')}>
                          {emp.faceRegisteredAt ? 'Registered' : 'Pending'}
                        </span>
                      </TableCell>
                      <TableCell><StatusBadge label={emp.isActive ? 'Active' : 'Inactive'} tone={emp.isActive ? 'success' : 'danger'} /></TableCell>
                      <TableCell>
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/employees/${emp.id}`)}>View</Button>
                          <ActionMenu
                            onView={() => router.push(`/admin/employees/${emp.id}`)}
                            onEdit={() => router.push(`/admin/employees/${emp.id}/edit`)}
                            onFace={() => setShowFaceWizardId(emp.id)}
                            onHistory={() => router.push(`/admin/employees/${emp.id}/history`)}
                            onDisable={async () => {
                              if (!confirm('Disable this user?')) return
                              try {
                                const res = await fetch(`/api/employees/${emp.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: false }) })
                                const j = await res.json()
                                if (res.ok && j.success) {
                                  setEmployees((prev) => prev.map((u) => (u.id === emp.id ? { ...u, isActive: false } : u)))
                                  alert('User disabled')
                                } else {
                                  alert(j.error || 'Failed to disable')
                                }
                              } catch (e) {
                                alert('Failed to disable')
                              }
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {showFaceWizardId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl">
                  <div className="p-6">
                    <FaceRegistrationWizard userId={showFaceWizardId} onClose={() => setShowFaceWizardId(null)} />
                  </div>
                </div>
              </div>
            )}

            {showImport && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold">Import CSV</h3>
                      <Button variant="ghost" size="sm" onClick={() => { setShowImport(false); setImportResult(null) }}>Close</Button>
                    </div>
                    <input
                      type="file"
                      accept="text/csv"
                      onChange={async (e) => {
                        const f = e.target.files?.[0]
                        if (!f) return
                        setImporting(true)
                        const txt = await f.text()
                        const lines = txt.split(/\r?\n/).filter(Boolean)
                        const headers = (lines[0]?.split(',') ?? []).map((h) => h.trim())
                        const rows = lines.slice(1).map((l) => {
                          const cols = l.split(',')
                          const obj: Record<string, string | undefined> = {}
                          headers.forEach((h, i) => {
                            obj[h] = cols[i]?.trim()
                          })
                          return obj
                        })
                        let success = 0
                        let failed = 0
                        const errors: any[] = []
                        for (const r of rows) {
                          try {
                            const payload = {
                              name: r.name || r.fullName || r.name,
                              phone: r.phone || r.mobile || undefined,
                              email: r.email || undefined,
                              pin: r.pin || r.PIN || '0000',
                              role: 'WORKER',
                            }
                            const res = await fetch('/api/employees', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(payload),
                            })
                            const j = await res.json()
                            if (res.ok && j.success) success++
                            else {
                              failed++
                              errors.push({ row: r, error: j.error })
                            }
                          } catch (e) {
                            failed++
                            errors.push({ row: r, error: String(e) })
                          }
                        }
                        setImportResult({ success, failed, errors })
                        setImporting(false)
                      }}
                    />
                    {importing && <div className="text-sm text-slate-500">Importing…</div>}
                    {importResult && <div className="text-sm text-slate-500">Imported: {importResult.success} succeeded, {importResult.failed} failed</div>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </SectionCard>
  )
}
