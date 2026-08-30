import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Database } from '../types/supabase';

type ServiceSession = Database['public']['Tables']['service_sessions']['Row'];
type CapturedMoment = Database['public']['Tables']['captured_moments']['Row'];

interface AppState {
  activeSession: ServiceSession | null;
  activeCaptures: CapturedMoment[];
  
  // Actions
  startSession: (session: ServiceSession) => void;
  endSession: () => void;
  addCapture: (capture: CapturedMoment) => void;
  updateCapture: (id: string, content: string) => void;
  removeCapture: (id: string) => void;
  clearSession: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeSession: null,
      activeCaptures: [],

      startSession: (session) => set({ activeSession: session, activeCaptures: [] }),
      
      endSession: () => set((state) => ({ 
        activeSession: state.activeSession ? { ...state.activeSession, status: 'completed', end_time: new Date().toISOString() } : null 
      })),
      
      addCapture: (capture) => set((state) => ({ 
        activeCaptures: [...state.activeCaptures, capture] 
      })),

      updateCapture: (id, content) => set((state) => ({
        activeCaptures: state.activeCaptures.map(c => c.id === id ? { ...c, content, updated_at: new Date().toISOString() } : c)
      })),

      removeCapture: (id) => set((state) => ({
        activeCaptures: state.activeCaptures.filter(c => c.id !== id)
      })),

      clearSession: () => set({ activeSession: null, activeCaptures: [] }),
    }),
    {
      name: 'sunday-os-storage', // name of item in the storage (must be unique)
    }
  )
);
