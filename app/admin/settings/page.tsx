import type { Metadata } from 'next'
import { prisma } from '@/lib/db'
import { SettingsForm } from '@/components/admin/settings/SettingsForm'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const settings = await prisma.globalSettings.findFirst() ?? {
    id: 'default',
    defaultStartTime: '09:00',
    defaultEndTime: '18:00',
    defaultLateThresholdMins: 15,
    defaultHalfDayThresholdMins: 240,
    defaultAbsentThresholdMins: 480,
    defaultGeofenceRadius: 100,
    faceConfidenceThreshold: 0.6,
    maxFaceAttempts: 3,
    gpsAccuracyThreshold: 50,
    offlineSyncEnabled: true,
    maxOfflineQueueHours: 24,
    companyName: 'AttendSP',
    companyLogo: null,
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    updatedAt: new Date(),
    updatedById: null,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400 mt-0.5">Configure attendance rules, thresholds, and company preferences</p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  )
}
