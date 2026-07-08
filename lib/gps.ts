/**
 * GPS Geofencing Utilities
 * Uses Haversine formula for accurate distance calculation
 * All GPS validation happens server-side too for security
 */

export interface GpsCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export interface GeofenceResult {
  isWithinRadius: boolean
  distanceMeters: number
  siteId?: string
  siteName?: string
}

/**
 * Haversine formula — calculates great-circle distance between two coordinates
 * Returns distance in meters
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Check if a coordinate is within a site's geofence
 */
export function isWithinGeofence(
  userLat: number,
  userLng: number,
  siteLat: number,
  siteLng: number,
  radiusMeters: number
): { isWithin: boolean; distance: number } {
  const distance = haversineDistance(userLat, userLng, siteLat, siteLng)
  return {
    isWithin: distance <= radiusMeters,
    distance: Math.round(distance),
  }
}

/**
 * Find which site (from a list) the user is currently at
 */
export function findMatchingSite<T extends {
  id: string
  name: string
  latitude: number
  longitude: number
  radiusMeters: number
}>(
  userLat: number,
  userLng: number,
  sites: T[]
): { site: T; distanceMeters: number } | null {
  let closestSite: { site: T; distanceMeters: number } | null = null
  let minDistance = Infinity

  for (const site of sites) {
    const { isWithin, distance } = isWithinGeofence(
      userLat,
      userLng,
      site.latitude,
      site.longitude,
      site.radiusMeters
    )

    if (isWithin && distance < minDistance) {
      minDistance = distance
      closestSite = { site, distanceMeters: distance }
    }
  }

  return closestSite
}

/**
 * GPS accuracy quality check
 */
export function getGpsAccuracyStatus(accuracy: number): {
  status: 'excellent' | 'good' | 'fair' | 'poor'
  label: string
  color: string
} {
  if (accuracy <= 10) return { status: 'excellent', label: 'Excellent GPS', color: 'text-emerald-400' }
  if (accuracy <= 30) return { status: 'good', label: 'Good GPS', color: 'text-emerald-400' }
  if (accuracy <= 50) return { status: 'fair', label: 'Fair GPS', color: 'text-amber-400' }
  return { status: 'poor', label: 'Poor GPS Signal', color: 'text-red-400' }
}

/**
 * Browser GPS helper — returns a Promise with coordinates
 */
export function getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
      ...options,
    })
  })
}

export function getGpsErrorMessage(error: GeolocationPositionError): string {
  switch (error.code) {
    case 1: return 'Location permission denied. Please allow location access and try again.'
    case 2: return 'Location unavailable. Please check your GPS settings.'
    case 3: return 'Location request timed out. Please try again in an open area.'
    default: return 'Unknown location error. Please try again.'
  }
}
