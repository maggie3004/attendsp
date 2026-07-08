/**
 * Attendance Rules Engine
 * Automatically determines attendance status from timing and GPS data
 * All thresholds are configurable per-site or globally
 */

import type { AttendanceStatus } from '@prisma/client'
import { parseTimeToMinutes, getCurrentTimeMinutes } from './utils'

export interface AttendanceRulesConfig {
  startTime: string        // "09:00"
  endTime: string          // "18:00"
  lateThresholdMins: number    // e.g. 15
  halfDayThresholdMins: number // e.g. 240 (4 hours)
  absentThresholdMins: number  // e.g. 480 (8 hours)
}

export interface AttendanceStatusResult {
  status: AttendanceStatus
  reason: string
  isLate: boolean
  minutesLate: number
  workDurationMins?: number
}

/**
 * Determine attendance status from check-in time
 */
export function determineCheckInStatus(
  checkInTime: Date,
  config: AttendanceRulesConfig
): AttendanceStatusResult {
  const startMins = parseTimeToMinutes(config.startTime)
  const checkInMins = checkInTime.getHours() * 60 + checkInTime.getMinutes()
  const minutesLate = Math.max(0, checkInMins - startMins)

  if (minutesLate === 0) {
    return {
      status: 'PRESENT',
      reason: 'On time',
      isLate: false,
      minutesLate: 0,
    }
  }

  if (minutesLate <= config.lateThresholdMins) {
    return {
      status: 'PRESENT',
      reason: `${minutesLate} min late (within threshold)`,
      isLate: false,
      minutesLate,
    }
  }

  if (minutesLate <= config.halfDayThresholdMins) {
    return {
      status: 'LATE',
      reason: `${minutesLate} min late`,
      isLate: true,
      minutesLate,
    }
  }

  if (minutesLate <= config.absentThresholdMins) {
    return {
      status: 'HALF_DAY',
      reason: `Arrived ${minutesLate} min late (half day threshold exceeded)`,
      isLate: true,
      minutesLate,
    }
  }

  return {
    status: 'ABSENT',
    reason: `Did not arrive within work hours`,
    isLate: true,
    minutesLate,
  }
}

/**
 * Determine final status from check-out including work duration
 */
export function determineFinalStatus(
  checkInTime: Date,
  checkOutTime: Date,
  config: AttendanceRulesConfig
): AttendanceStatusResult {
  const workDurationMins = Math.floor(
    (checkOutTime.getTime() - checkInTime.getTime()) / 60000
  )

  const initialStatus = determineCheckInStatus(checkInTime, config)

  // If worked half day or less, downgrade to HALF_DAY
  if (workDurationMins < config.halfDayThresholdMins && initialStatus.status === 'PRESENT') {
    return {
      ...initialStatus,
      status: 'HALF_DAY',
      reason: `Worked only ${workDurationMins} minutes`,
      workDurationMins,
    }
  }

  return { ...initialStatus, workDurationMins }
}

/**
 * Check if a worker should be marked ABSENT at end of day
 */
export function shouldMarkAbsent(
  hasAttendance: boolean,
  hasApprovedLeave: boolean,
  hasTravelDuty: boolean
): boolean {
  return !hasAttendance && !hasApprovedLeave && !hasTravelDuty
}

/**
 * Validate face recognition confidence
 */
export function isFaceConfidenceAcceptable(
  confidence: number,
  threshold = 0.6
): boolean {
  return confidence >= threshold
}

/**
 * Validate GPS accuracy
 */
export function isGpsAccuracyAcceptable(
  accuracy: number,
  maxAccuracyMeters = 50
): boolean {
  return accuracy <= maxAccuracyMeters
}
