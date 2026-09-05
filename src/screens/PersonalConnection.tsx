import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Target } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'

export default function PersonalConnection() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [initialNeeds, setInitialNeeds] = useState<string[]>([])
  const [connection, setConnection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!activeSession) {
      navigate('/')
      return
    }

    const fetchIntentions = async () => {
      const { data } = await supabase
        .from('intentions')
        .select('selected_needs')
        .eq('session_id', activeSession.id)
        .single()
        
      if (data && data.selected_needs) {
        setInitialNeeds(data.selected_needs)
      }
    }

    fetchIntentions()
  }, [activeSession, navigate])

  const handleSubmit = async () => {
    // In a full implementation, we'd save this 'connection' to a connections table or append to reflections.
    // For now, we just pass to the next step since it's a qualitative exercise.
    navigate('/action')
  }

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Step 3 of 3</p>
        <h1>Connect to Life</h1>
      </div>

      <div className="flex-col gap-xl flex-1">
        
        {initialNeeds.length > 0 && (
          <div className="card bg-surface-2 border-primary-dim">
            <div className="flex items-center gap-sm mb-sm text-primary">
              <Target size={18} />
              <h3 className="text-sm">You came seeking:</h3>
            </div>
            <div className="flex flex-wrap gap-xs">
              {initialNeeds.map(need => (
                <span key={need} className="label-sm font-bold text-1 bg-surface py-xs px-sm rounded-md border border-border">
                  {need}
                </span>
              ))}
            </div>
          </div>
        )}

        <section className="input-group">
          <label className="input-label">How did today's message speak directly to what you were seeking?</label>
          <textarea 
            className="input-field" 
            rows={5}
            placeholder="Write your thoughts..."
            value={connection}
            onChange={(e) => setConnection(e.target.value)}
          />
        </section>

      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting || connection.trim().length === 0}
        >
          {isSubmitting ? 'Saving...' : 'Set Action Item'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}
