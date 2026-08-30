export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          created_at?: string
        }
      }
      service_sessions: {
        Row: {
          id: string
          user_id: string
          date: string
          church_name: string | null
          preacher_name: string | null
          sermon_title: string | null
          start_time: string
          end_time: string | null
          status: 'in_progress' | 'completed' | 'abandoned'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          church_name?: string | null
          preacher_name?: string | null
          sermon_title?: string | null
          start_time?: string
          end_time?: string | null
          status?: 'in_progress' | 'completed' | 'abandoned'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          church_name?: string | null
          preacher_name?: string | null
          sermon_title?: string | null
          start_time?: string
          end_time?: string | null
          status?: 'in_progress' | 'completed' | 'abandoned'
          created_at?: string
        }
      }
      intentions: {
        Row: {
          id: string
          session_id: string
          selected_needs: string[]
          personal_context: string | null
          desired_outcome: string | null
          presence_intentions: string[]
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          selected_needs?: string[]
          personal_context?: string | null
          desired_outcome?: string | null
          presence_intentions?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          selected_needs?: string[]
          personal_context?: string | null
          desired_outcome?: string | null
          presence_intentions?: string[]
          created_at?: string
        }
      }
      captured_moments: {
        Row: {
          id: string
          session_id: string
          category: 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action'
          content: string
          timestamp_seconds: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          category: 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action'
          content: string
          timestamp_seconds: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          category?: 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action'
          content?: string
          timestamp_seconds?: number
          created_at?: string
          updated_at?: string
        }
      }
      sermon_content: {
        Row: {
          id: string
          session_id: string
          title: string | null
          preacher: string | null
          church: string | null
          audio_url: string | null
          transcript: string | null
          source_type: 'audio' | 'text' | 'notes'
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          title?: string | null
          preacher?: string | null
          church?: string | null
          audio_url?: string | null
          transcript?: string | null
          source_type: 'audio' | 'text' | 'notes'
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          title?: string | null
          preacher?: string | null
          church?: string | null
          audio_url?: string | null
          transcript?: string | null
          source_type?: 'audio' | 'text' | 'notes'
          created_at?: string
        }
      }
      sermon_analysis: {
        Row: {
          id: string
          session_id: string
          main_theme: string | null
          one_sentence_summary: string | null
          key_ideas: Json | null
          scriptures: Json | null
          key_moments: Json | null
          generated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          main_theme?: string | null
          one_sentence_summary?: string | null
          key_ideas?: Json | null
          scriptures?: Json | null
          key_moments?: Json | null
          generated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          main_theme?: string | null
          one_sentence_summary?: string | null
          key_ideas?: Json | null
          scriptures?: Json | null
          key_moments?: Json | null
          generated_at?: string
        }
      }
      reflections: {
        Row: {
          id: string
          session_id: string
          remembered_most: string | null
          personal_takeaway: string | null
          life_application: string | null
          potential_change: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          remembered_most?: string | null
          personal_takeaway?: string | null
          life_application?: string | null
          potential_change?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          remembered_most?: string | null
          personal_takeaway?: string | null
          life_application?: string | null
          potential_change?: string | null
          created_at?: string
        }
      }
      revelation_maps: {
        Row: {
          id: string
          session_id: string
          nodes: Json
          edges: Json
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          nodes: Json
          edges: Json
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          nodes?: Json
          edges?: Json
          created_at?: string
        }
      }
      action_commitments: {
        Row: {
          id: string
          session_id: string
          action: string
          deadline: string | null
          reason: string | null
          status: 'pending' | 'completed' | 'skipped'
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          action: string
          deadline?: string | null
          reason?: string | null
          status?: 'pending' | 'completed' | 'skipped'
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          action?: string
          deadline?: string | null
          reason?: string | null
          status?: 'pending' | 'completed' | 'skipped'
          completed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
