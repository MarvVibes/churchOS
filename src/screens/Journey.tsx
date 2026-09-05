import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { MOCK_USER_ID } from '../lib/services'
import type { Database } from '../types/supabase'

type ServiceSession = Database['public']['Tables']['service_sessions']['Row']

export default function Journey() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<ServiceSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from('service_sessions')
        .select('*')
        .eq('user_id', MOCK_USER_ID)
        .order('created_at', { ascending: false })

      setSessions(data || [])
      setIsLoading(false)
    }

    fetchSessions()
  }, [])

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Church OS</p>
        <h1>My Journey</h1>
      </div>

      {isLoading ? (
        <div className="state-center text-3 flex-1">
          <Search className="mb-sm animate-pulse" size={32} />
          <p>Loading history...</p>
        </div>
      ) : sessions.length > 0 ? (
        <div className="scroll-list flex-1">
          {sessions.map((session) => (
            <div 
              key={session.id} 
              className="card card-interactive"
              onClick={() => navigate(`/journey/${session.id}`)}
            >
              <div className="flex justify-between items-center mb-xs">
                <h3 className="text-lg">{session.sermon_title || 'Sunday Service'}</h3>
                <span className="text-xs text-3 font-bold bg-surface-2 px-sm py-xs rounded-full">
                  {new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-2">
                {session.preacher_name ? `${session.preacher_name} • ` : ''}
                {session.church_name || 'Church'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="state-center text-3 flex-1">
          <Calendar className="mb-sm opacity-50" size={32} />
          <p>No journey records yet.</p>
        </div>
      )}
    </div>
  )
}
