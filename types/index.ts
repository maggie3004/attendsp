/**
 * Shared TypeScript types across the application
 */

import type {
  User,
  Employee,
  Site,
  AttendanceRecord,
  AttendanceStatus,
  LeaveRequest,
  TravelDuty,
  AuditLog,
  UserRole,
} from '@prisma/client'

// Auth types removed to avoid duplication and module not found errors
// ─── API RESPONSE ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── DASHBOARD STATS ─────────────────────────────────────────

export interface DashboardStats {
  totalEmployees: number
  presentToday: number
  lateToday: number
  halfDayToday: number
  absentToday: number
  onLeave: number
  travelDuty: number
  presentPercentage: number
  byStatus: Record<AttendanceStatus, number>
}

export interface SiteStats {
  siteId: string
  siteName: string
  total: number
  present: number
  absent: number
  late: number
}

// ─── EMPLOYEE WITH RELATIONS ──────────────────────────────────

export type UserWithEmployee = User & {
  employee: (Employee & {
    siteAssignments: {
      site: Site
      isPrimary: boolean
      isActive: boolean
    }[]
  }) | null
}

export type AttendanceWithRelations = AttendanceRecord & {
  user: Pick<User, 'id' | 'name' | 'employeeId' | 'profileImageUrl'>
  site: Pick<Site, 'id' | 'name' | 'code'> | null
}

// ─── FACE RECOGNITION ────────────────────────────────────────

export interface FaceDescriptor {
  descriptor: number[] // 128-dimensional embedding
  confidence: number
}

export interface FaceVerificationResult {
  verified: boolean
  confidence: number
  distance: number
  userId?: string
}

// ─── GPS ─────────────────────────────────────────────────────

export interface GpsData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface GeofenceMatch {
  siteId: string
  siteName: string
  distanceMeters: number
  isWithin: boolean
}

// ─── OFFLINE QUEUE ───────────────────────────────────────────

export interface OfflineAttendancePayload {
  userId: string
  captureImage: string
  gpsData: GpsData
  timestamp: number
  deviceId: string
  checksum: string
}

// ─── ATTENDANCE STEP (Worker flow) ───────────────────────────

export type AttendanceStep =
  | 'idle'
  | 'gps'
  | 'camera'
  | 'capture'
  | 'verifying'
  | 'saving'
  | 'success'
  | 'error'

export interface AttendanceStepState {
  step: AttendanceStep
  gpsData: GpsData | null
  capturedImage: string | null
  faceDescriptor: number[] | null
  faceConfidence: number | null
  matchedSite: GeofenceMatch | null
  errorMessage: string | null
  isOffline: boolean
}

// ─── REPORT ──────────────────────────────────────────────────

export interface ReportFilters {
  dateFrom: string
  dateTo: string
  siteId?: string
  userId?: string
  status?: AttendanceStatus
}

export type ReportRow = {
  date: string
  employeeId: string
  name: string
  site: string
  checkIn: string
  checkOut: string
  status: string
  workHours: string
}
