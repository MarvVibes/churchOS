import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type ServiceSession = Database['public']['Tables']['service_sessions']['Row']

export const MOCK_USER_ID = 'mock-user-123'

export async function fetchRecentSessions(userId: string): Promise<ServiceSession[]> {
  const { data, error } = await supabase
    .from('service_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('fetchRecentSessions error:', error)
    return []
  }
  return data ?? []
}

export async function createSession(
  payload: Database['public']['Tables']['service_sessions']['Insert']
): Promise<ServiceSession> {
  const { data, error } = await supabase
    .from('service_sessions')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}
