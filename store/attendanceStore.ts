/**
 * Zustand Store — Attendance Flow & Offline Queue
 * Persists offline queue to localStorage for resilience
 */

'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AttendanceStep, AttendanceStepState, OfflineAttendancePayload } from '@/types'

// ─── ATTENDANCE FLOW STORE ────────────────────────────────────

interface AttendanceStore extends AttendanceStepState {
  setStep: (step: AttendanceStep) => void
  setGpsData: (data: AttendanceStepState['gpsData']) => void
  setCapturedImage: (img: string | null) => void
  setFaceDescriptor: (descriptor: number[] | null, confidence: number | null) => void
  setMatchedSite: (site: AttendanceStepState['matchedSite']) => void
  setError: (message: string | null) => void
  setIsOffline: (offline: boolean) => void
  reset: () => void
}

const initialState: AttendanceStepState = {
  step: 'idle',
  gpsData: null,
  capturedImage: null,
  faceDescriptor: null,
  faceConfidence: null,
  matchedSite: null,
  errorMessage: null,
  isOffline: false,
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setGpsData: (gpsData) => set({ gpsData }),
  setCapturedImage: (capturedImage) => set({ capturedImage }),
  setFaceDescriptor: (faceDescriptor, faceConfidence) => set({ faceDescriptor, faceConfidence }),
  setMatchedSite: (matchedSite) => set({ matchedSite }),
  setError: (errorMessage) => set({ errorMessage, step: 'error' }),
  setIsOffline: (isOffline) => set({ isOffline }),
  reset: () => set(initialState),
}))

// ─── OFFLINE QUEUE STORE ──────────────────────────────────────

interface OfflineQueueEntry extends OfflineAttendancePayload {
  id: string
  synced: boolean
  failedAttempts: number
  lastAttemptAt?: number
}

interface OfflineQueueStore {
  queue: OfflineQueueEntry[]
  addToQueue: (payload: OfflineAttendancePayload) => void
  markSynced: (id: string) => void
  markFailed: (id: string) => void
  removeEntry: (id: string) => void
  getPendingEntries: () => OfflineQueueEntry[]
  clearSynced: () => void
}

export const useOfflineQueueStore = create<OfflineQueueStore>()(
  persist(
    (set, get) => ({
      queue: [],
      addToQueue: (payload) =>
        set((state) => ({
          queue: [
            ...state.queue,
            {
              ...payload,
              id: `offline-${Date.now()}-${Math.random().toString(36).slice(2)}`,
              synced: false,
              failedAttempts: 0,
            },
          ],
        })),
      markSynced: (id) =>
        set((state) => ({
          queue: state.queue.map((e) =>
            e.id === id ? { ...e, synced: true } : e
          ),
        })),
      markFailed: (id) =>
        set((state) => ({
          queue: state.queue.map((e) =>
            e.id === id
              ? { ...e, failedAttempts: e.failedAttempts + 1, lastAttemptAt: Date.now() }
              : e
          ),
        })),
      removeEntry: (id) =>
        set((state) => ({ queue: state.queue.filter((e) => e.id !== id) })),
      getPendingEntries: () => get().queue.filter((e) => !e.synced && e.failedAttempts < 3),
      clearSynced: () =>
        set((state) => ({ queue: state.queue.filter((e) => !e.synced) })),
    }),
    {
      name: 'attendsp-offline-queue',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
