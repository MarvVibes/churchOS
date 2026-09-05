import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, Calendar, MapPin, Search } from 'lucide-react'
import { useAppStore } from '../store'
import { fetchRecentSessions, MOCK_USER_ID } from '../lib/services'
import type { Database } from '../types/supabase'

type ServiceSession = Database['public']['Tables']['service_sessions']['Row']

export default function Home() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [recentSessions, setRecentSessions] = useState<ServiceSession[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSessions() {
      setIsLoading(true)
      const data = await fetchRecentSessions(MOCK_USER_ID)
      setRecentSessions(data)
      setIsLoading(false)
    }
    loadSessions()
  }, [])

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <p className="subtitle">Church OS</p>
        <h1>Welcome Back</h1>
        <p className="mt-2">Your spiritual journey, captured and connected.</p>
      </div>

      {activeSession && (
        <div 
          className="card card-primary card-interactive mb-lg"
          onClick={() => navigate('/service')}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="label-xs mb-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Active Session</p>
              <h3>Resume Service</h3>
            </div>
            <div className="live-dot" />
          </div>
        </div>
      )}

      {!activeSession && (
        <button 
          className="btn btn-primary mb-xl"
          onClick={() => navigate('/start')}
        >
          <Play size={18} />
          Start My Sunday
        </button>
      )}

      <div className="section-header">Recent Sundays</div>
      
      {isLoading ? (
        <div className="state-center text-3">
          <Search className="mb-sm animate-pulse" size={32} />
          <p>Loading your journey...</p>
        </div>
      ) : recentSessions.length > 0 ? (
        <div className="scroll-list">
          {recentSessions.map(session => (
            <div 
              key={session.id} 
              className="card card-interactive"
              onClick={() => navigate(`/journey/${session.id}`)}
            >
              <div className="flex justify-between items-center mb-sm">
                <h3 className="font-bold">{session.sermon_title || 'Sunday Service'}</h3>
                <span className="label-xs text-3">
                  {new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-sm text-2 text-sm">
                <MapPin size={14} />
                <span>{session.church_name || 'Church'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="state-center text-3">
          <Calendar className="mb-sm opacity-50" size={32} />
          <p>No recorded sessions yet.</p>
          <p className="text-sm mt-xs">Start a session to begin tracking.</p>
        </div>
      )}
    </div>
  )
}
