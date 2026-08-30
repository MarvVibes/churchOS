import { supabase } from './supabase';
import type { Database } from '../types/supabase';
type ServiceSession = Database['public']['Tables']['service_sessions']['Row'];

export const fetchRecentSessions = async (userId: string) => {
  const { data, error } = await supabase
    .from('service_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
  return data;
};

export const createSession = async (session: Omit<ServiceSession, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('service_sessions')
    .insert(session)
    .select()
    .single();

  if (error) {
    console.error('Error creating session:', error);
    throw error;
  }
  return data;
};

// Simulated demo data generator if none exists
export const generateDemoDataIfNeeded = async (userId: string) => {
  const sessions = await fetchRecentSessions(userId);
  if (sessions && sessions.length > 0) return;

  // Insert demo session
  const demoSession = {
    user_id: userId,
    date: new Date().toISOString(),
    sermon_title: 'Faith That Moves',
    start_time: new Date(Date.now() - 3600000).toISOString(),
    end_time: new Date().toISOString(),
    status: 'completed' as const
  };

  try {
    const session = await createSession(demoSession);
    
    // Add some captures
    await supabase.from('captured_moments').insert([
      { session_id: session.id, category: 'insight', content: 'I keep waiting for clarity while ignoring what I already know.', timestamp_seconds: 600 },
      { session_id: session.id, category: 'scripture', content: 'James 2:17', timestamp_seconds: 1200 },
      { session_id: session.id, category: 'powerful_moment', content: 'Genuine faith is demonstrated through action, especially when certainty is unavailable.', timestamp_seconds: 1800 }
    ]);

    // Add action commitment
    await supabase.from('action_commitments').insert({
      session_id: session.id,
      action: 'Complete and publish my proposal.',
      deadline: 'Wednesday',
      status: 'pending'
    });
    
    // Add simulated AI processing (Sermon Analysis)
    await supabase.from('sermon_analysis').insert({
      session_id: session.id,
      main_theme: 'Faith That Moves',
      one_sentence_summary: 'Genuine faith is demonstrated through action, especially when certainty is unavailable.',
      key_ideas: [
        { title: 'Faith Requires Movement', explanation: 'Faith is not a passive waiting game.' },
        { title: 'Waiting Is Not Always Obedience', explanation: 'Sometimes God is waiting on us to take the first step.' }
      ],
      scriptures: ['James 2:17', 'Hebrews 11:1'],
      key_moments: ['When he said "Delayed obedience is still disobedience."']
    });

  } catch (err) {
    console.error('Demo data generation failed', err);
  }
};
