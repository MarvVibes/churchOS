import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Database } from '../types/supabase'

type ServiceSession = Database['public']['Tables']['service_sessions']['Row']
type CapturedMoment = Database['public']['Tables']['captured_moments']['Row']

interface AppState {
  activeSession: ServiceSession | null
  activeCaptures: CapturedMoment[]
  manualNotes: string[]
  // Actions
  startSession: (session: ServiceSession) => void
  endSession: () => void
  addCapture: (capture: CapturedMoment) => void
  updateCapture: (id: string, content: string) => void
  removeCapture: (id: string) => void
  addManualNote: (note: string) => void
  clearSession: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeSession: null,
      activeCaptures: [],
      manualNotes: [],

      startSession: (session) =>
        set({ activeSession: session, activeCaptures: [], manualNotes: [] }),

      endSession: () =>
        set((s) => ({
          activeSession: s.activeSession
            ? { ...s.activeSession, status: 'completed', end_time: new Date().toISOString() }
            : null,
        })),

      addCapture: (capture) =>
        set((s) => ({ activeCaptures: [...s.activeCaptures, capture] })),

      updateCapture: (id, content) =>
        set((s) => ({
          activeCaptures: s.activeCaptures.map((c) =>
            c.id === id ? { ...c, content, updated_at: new Date().toISOString() } : c
          ),
        })),

      removeCapture: (id) =>
        set((s) => ({
          activeCaptures: s.activeCaptures.filter((c) => c.id !== id),
        })),

      addManualNote: (note) =>
        set((s) => ({ manualNotes: [...s.manualNotes, note] })),

      clearSession: () =>
        set({ activeSession: null, activeCaptures: [], manualNotes: [] }),
    }),
    { name: 'church-os-store' }
  )
)
