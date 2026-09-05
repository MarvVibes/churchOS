import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BookOpen, Key, Brain } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'
import type { Database } from '../types/supabase'

type SermonAnalysis = Database['public']['Tables']['sermon_analysis']['Row']

export default function SermonReport() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [analysis, setAnalysis] = useState<SermonAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!activeSession) {
      navigate('/')
      return
    }

    const fetchAnalysis = async () => {
      const { data } = await supabase
        .from('sermon_analysis')
        .select('*')
        .eq('session_id', activeSession.id)
        .single()
        
      setAnalysis(data)
      setIsLoading(false)
    }

    fetchAnalysis()
  }, [activeSession, navigate])

  if (isLoading) {
    return (
      <div className="state-center text-3 h-full">
        <Brain className="mb-sm animate-pulse" size={32} />
        <p>Loading AI Analysis...</p>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="state-center text-3 h-full">
        <p>No analysis found.</p>
        <button className="btn btn-secondary mt-md" onClick={() => navigate('/connection')}>
          Skip to next step
        </button>
      </div>
    )
  }

  const scriptures = (analysis.scriptures as any[]) || []
  const keyIdeas = (analysis.key_ideas as string[]) || []

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Step 2 of 3</p>
        <h1>Sermon Report</h1>
        <p className="mt-2 text-2">AI synthesis of the sermon and your notes.</p>
      </div>

      <div className="flex-col gap-xl flex-1">
        
        {/* Main Theme & Summary */}
        <div className="card card-primary">
          <h2 className="mb-sm text-xl">{analysis.main_theme}</h2>
          <p className="text-sm opacity-90">{analysis.one_sentence_summary}</p>
        </div>

        {/* Key Ideas */}
        <div>
          <div className="flex items-center gap-sm mb-md">
            <Key size={18} className="text-accent" />
            <h3 className="text-lg">Key Ideas</h3>
          </div>
          <div className="flex-col gap-sm">
            {keyIdeas.map((idea, idx) => (
              <div key={idx} className="card py-sm px-md border-l-2" style={{ borderLeftColor: 'var(--color-accent)' }}>
                <p className="text-sm text-1">{idea}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scriptures */}
        {scriptures.length > 0 && (
          <div>
            <div className="flex items-center gap-sm mb-md">
              <BookOpen size={18} className="text-primary" />
              <h3 className="text-lg">Scriptures Referenced</h3>
            </div>
            <div className="flex-col gap-sm">
              {scriptures.map((scripture, idx) => (
                <div key={idx} className="card py-sm px-md bg-surface-2">
                  <p className="font-bold text-sm mb-xs text-primary">{scripture.reference}</p>
                  <p className="text-xs text-2 italic">"{scripture.text}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-secondary mb-sm"
          onClick={() => navigate('/map')}
        >
          View Revelation Map
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/connection')}
        >
          Connect to Life
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
