import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import type { AttendanceStatus } from '@prisma/client'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, fmt = 'dd MMM yyyy') {
  return format(new Date(date), fmt)
}

export function formatTime(date: Date | string) {
  return format(new Date(date), 'hh:mm a')
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), 'dd MMM yyyy, hh:mm a')
}

export function timeAgo(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function generateEmployeeId(count: number): string {
  return `EMP-${String(count + 1).padStart(4, '0')}`
}

export function generateSiteCode(count: number): string {
  return `SITE-${String(count + 1).padStart(3, '0')}`
}

export function getStatusColor(status: AttendanceStatus): string {
  const colors: Record<AttendanceStatus, string> = {
    PRESENT: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    LATE: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    HALF_DAY: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    ABSENT: 'bg-red-500/15 text-red-400 border-red-500/30',
    LEAVE: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    TRAVEL_DUTY: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    MANUAL_OVERRIDE: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    PENDING: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
  }
  return colors[status] ?? 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
}

export function getStatusLabel(status: AttendanceStatus): string {
  const labels: Record<AttendanceStatus, string> = {
    PRESENT: 'Present',
    LATE: 'Late',
    HALF_DAY: 'Half Day',
    ABSENT: 'Absent',
    LEAVE: 'On Leave',
    TRAVEL_DUTY: 'Travel Duty',
    MANUAL_OVERRIDE: 'Override',
    PENDING: 'Pending',
  }
  return labels[status] ?? status
}

export function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}

export function getCurrentTimeMinutes(): number {
  const now = new Date()
  return now.getHours() * 60 + now.getMinutes()
}
