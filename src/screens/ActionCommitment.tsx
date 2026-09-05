import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, ArrowRight } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'
import { addDays, format } from 'date-fns'

const TIMEFRAMES = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'By Wednesday', days: 3 },
  { label: 'By Next Sunday', days: 7 }
]

export default function ActionCommitment() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [action, setAction] = useState('')
  const [selectedTimeframe, setSelectedTimeframe] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!activeSession) {
    navigate('/')
    return null
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      let deadline = null
      if (selectedTimeframe !== null) {
        deadline = addDays(new Date(), selectedTimeframe).toISOString()
      }

      await supabase
        .from('action_commitments')
        .insert({
          session_id: activeSession.id,
          action: action.trim(),
          deadline: deadline,
          status: 'pending'
        })

      navigate('/final-report')
    } catch (err) {
      console.error('Failed to save action:', err)
      alert('Failed to save. Please try again.')
      setIsSubmitting(false)
    }
  }

  const isComplete = action.trim().length > 0 && selectedTimeframe !== null

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Final Step</p>
        <h1>Action Commitment</h1>
        <p className="mt-2 text-2">Faith without works is dead. What is one specific thing you will do?</p>
      </div>

      <div className="flex-col gap-xl flex-1">
        
        <section className="input-group">
          <label className="input-label flex items-center gap-xs text-success">
            <CheckSquare size={16} /> I commit to...
          </label>
          <textarea 
            className="input-field" 
            rows={3}
            placeholder="e.g., Have that difficult conversation with my brother."
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </section>

        <section className="input-group mt-md">
          <label className="input-label">By when?</label>
          <div className="pill-group">
            {TIMEFRAMES.map((tf, idx) => (
              <button
                key={idx}
                className={`pill ${selectedTimeframe === tf.days ? 'selected' : ''}`}
                onClick={() => setSelectedTimeframe(tf.days)}
              >
                {tf.label}
                {selectedTimeframe === tf.days && (
                  <span className="block text-xs opacity-70 mt-xs">
                    {format(addDays(new Date(), tf.days), 'MMM d')}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary bg-success border-success"
          style={{ backgroundColor: 'var(--color-success)', color: '#000' }}
          onClick={handleSubmit}
          disabled={isSubmitting || !isComplete}
        >
          {isSubmitting ? 'Saving...' : 'Lock it in'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}
