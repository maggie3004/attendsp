/**
 * Zod Validation Schemas
 * Shared between API routes and client forms
 */

import { z } from 'zod'

// ─── AUTH ────────────────────────────────────────────────────

export const loginSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  pin: z.string().min(4, 'PIN must be at least 4 digits').max(6, 'PIN must be at most 6 digits'),
})

// ─── EMPLOYEE ────────────────────────────────────────────────

export const createEmployeeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  pin: z.string().min(4).max(6),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'SUPERVISOR', 'WORKER']).default('WORKER'),
  designation: z.string().optional(),
  department: z.string().optional(),
  joiningDate: z.string().optional(),
  primarySiteId: z.string().optional(),
})

export const updateEmployeeSchema = createEmployeeSchema.partial().omit({ pin: true })

export const changePinSchema = z.object({
  newPin: z.string().min(4).max(6),
  reason: z.string().min(1),
})

// ─── SITE ────────────────────────────────────────────────────

export const createSiteSchema = z.object({
  name: z.string().min(2, 'Site name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  radiusMeters: z.number().min(10).max(5000).default(100),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  lateThresholdMins: z.number().min(0).max(120).optional(),
  halfDayThresholdMins: z.number().min(60).max(480).optional(),
  description: z.string().optional(),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
})

export const updateSiteSchema = createSiteSchema.partial()

// ─── ATTENDANCE ───────────────────────────────────────────────

export const markAttendanceSchema = z.object({
  captureImage: z.string().min(1, 'Face image is required'), // base64
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().min(0),
  timestamp: z.number(),
  deviceId: z.string().optional(),
  isOffline: z.boolean().default(false),
  offlineChecksum: z.string().optional(),
})

export const attendanceOverrideSchema = z.object({
  newStatus: z.enum(['PRESENT', 'LATE', 'HALF_DAY', 'ABSENT', 'LEAVE', 'TRAVEL_DUTY', 'MANUAL_OVERRIDE']),
  newCheckIn: z.string().optional(),
  newCheckOut: z.string().optional(),
  reason: z.string().min(5, 'Please provide a reason for the override'),
  notes: z.string().optional(),
})

// ─── LEAVE ───────────────────────────────────────────────────

export const applyLeaveSchema = z.object({
  type: z.enum(['CASUAL', 'SICK', 'ANNUAL', 'EMERGENCY', 'UNPAID', 'COMPENSATORY']),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(10, 'Please provide a detailed reason'),
  isEmergency: z.boolean().default(false),
})

export const respondLeaveSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  approverNote: z.string().optional(),
})

// ─── TRAVEL DUTY ─────────────────────────────────────────────

export const createTravelDutySchema = z.object({
  userId: z.string(),
  destination: z.string().min(2),
  purpose: z.string().min(5),
  startDate: z.string(),
  endDate: z.string(),
  siteId: z.string().optional(),
})

// ─── SETTINGS ────────────────────────────────────────────────

export const updateSettingsSchema = z.object({
  defaultStartTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  defaultEndTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  defaultLateThresholdMins: z.number().min(0).max(120).optional(),
  defaultHalfDayThresholdMins: z.number().min(60).max(480).optional(),
  defaultGeofenceRadius: z.number().min(10).max(5000).optional(),
  faceConfidenceThreshold: z.number().min(0.3).max(0.99).optional(),
  gpsAccuracyThreshold: z.number().min(10).max(500).optional(),
  companyName: z.string().optional(),
  timezone: z.string().optional(),
})

// Types inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>
export type CreateEmployeeInput = z.input<typeof createEmployeeSchema>
export type UpdateEmployeeInput = z.input<typeof updateEmployeeSchema>
export type CreateSiteInput = z.input<typeof createSiteSchema>
export type MarkAttendanceInput = z.infer<typeof markAttendanceSchema>
export type AttendanceOverrideInput = z.infer<typeof attendanceOverrideSchema>
export type ApplyLeaveInput = z.infer<typeof applyLeaveSchema>
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>
