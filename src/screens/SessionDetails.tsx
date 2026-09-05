import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Calendar, Network } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type ServiceSession = Database['public']['Tables']['service_sessions']['Row']
type SermonAnalysis = Database['public']['Tables']['sermon_analysis']['Row']
type ActionCommitment = Database['public']['Tables']['action_commitments']['Row']

export default function SessionDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [session, setSession] = useState<ServiceSession | null>(null)
  const [analysis, setAnalysis] = useState<SermonAnalysis | null>(null)
  const [action, setAction] = useState<ActionCommitment | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const [sessionRes, analysisRes, actionRes] = await Promise.all([
        supabase.from('service_sessions').select('*').eq('id', id).single(),
        supabase.from('sermon_analysis').select('*').eq('session_id', id).single(),
        supabase.from('action_commitments').select('*').eq('session_id', id).single(),
      ])

      if (sessionRes.data) setSession(sessionRes.data)
      if (analysisRes.data) setAnalysis(analysisRes.data)
      if (actionRes.data) setAction(actionRes.data)

      setIsLoading(false)
    }

    fetchData()
  }, [id])

  if (isLoading) {
    return <div className="state-center text-3 h-full"><p>Loading details...</p></div>
  }

  if (!session) {
    return <div className="state-center text-3 h-full"><p>Session not found.</p></div>
  }

  const date = new Date(session.start_time).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  })

  return (
    <div className="animate-fade-in flex-col h-full bg-surface" style={{ minHeight: '100vh', margin: '-var(--space-lg)', padding: 'var(--space-lg)' }}>
      
      <div className="flex items-center gap-md mb-xl mt-sm">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-lg leading-tight">{session.sermon_title || 'Sunday Service'}</h2>
          <p className="text-xs text-3 tracking-widest uppercase mt-xs">{date}</p>
        </div>
      </div>

      <div className="flex-col gap-lg pb-xl">
        
        <div className="card flex items-center gap-md">
          <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-primary">
            <MapPin size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">{session.church_name || 'Church'}</p>
            <p className="text-xs text-2">{session.preacher_name || 'Preacher'}</p>
          </div>
        </div>

        {analysis && (
          <div className="card card-primary">
            <p className="text-xs font-bold tracking-widest uppercase mb-xs opacity-70">Theme</p>
            <h3 className="mb-sm">{analysis.main_theme}</h3>
            <p className="text-sm opacity-90">{analysis.one_sentence_summary}</p>
          </div>
        )}

        {action && (
          <div>
            <div className="flex items-center gap-sm mb-sm">
              <Calendar size={18} className="text-success" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-3">Action Commitment</h3>
            </div>
            <div className={`card ${action.status === 'completed' ? 'border-success' : 'border-border'}`}>
              <p className="text-sm">{action.action}</p>
              {action.deadline && (
                <p className="text-xs text-2 mt-sm">
                  Target: {new Date(action.deadline).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {analysis && (
          <button 
            className="btn btn-secondary mt-md"
            onClick={() => navigate('/map')}
          >
            <Network size={18} />
            View Revelation Map
          </button>
        )}

      </div>
    </div>
  )
}
