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
  const classes: Record<AttendanceStatus, string> = {
    PRESENT: 'status-present',
    LATE: 'status-late',
    HALF_DAY: 'status-halfday',
    ABSENT: 'status-absent',
    LEAVE: 'status-leave',
    TRAVEL_DUTY: 'status-travel',
    MANUAL_OVERRIDE: 'status-override',
    PENDING: 'status-pending',
  }
  return classes[status] ?? 'status-pending'
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
