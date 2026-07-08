import { Select } from '@/components/ui/Form'
import { Button } from '@/components/ui/Button'
import { SearchInput } from '@/components/ui/DesignSystem'

interface FilterBarProps {
  search: string
  setSearch: (v: string) => void
  sites: { id: string; name: string }[]
  siteFilter: string
  setSiteFilter: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  faceFilter: string
  setFaceFilter: (v: string) => void
  clear: () => void
}

export function FilterBar({ search, setSearch, sites, siteFilter, setSiteFilter, statusFilter, setStatusFilter, faceFilter, setFaceFilter, clear }: FilterBarProps) {
  return (
    <div className="grid gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.05)] lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
      <SearchInput value={search} onChange={setSearch} placeholder="Search workers, ID, phone..." className="lg:col-span-1" />
      <Select value={siteFilter} onChange={(e) => setSiteFilter(e.target.value)}>
        <option value="">All sites</option>
        {sites.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </Select>
      <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">Any status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="suspended">Suspended</option>
      </Select>
      <Select value={faceFilter} onChange={(e) => setFaceFilter(e.target.value)}>
        <option value="">Any face</option>
        <option value="registered">Registered</option>
        <option value="pending">Pending</option>
        <option value="missing">Missing</option>
      </Select>
      <div className="flex items-center">
        <Button variant="outline" size="sm" onClick={clear} className="w-full">Clear</Button>
      </div>
    </div>
  )
}
