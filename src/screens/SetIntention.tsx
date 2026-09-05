import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Play } from 'lucide-react'
import { createSession, MOCK_USER_ID } from '../lib/services'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'

const INTENTIONS = [
  'Listen actively', 'Take notes', 'Be present', 
  'Pray for others', 'Worship freely'
]

export default function SetIntention() {
  const navigate = useNavigate()
  const location = useLocation()
  const { startSession } = useAppStore()
  
  const { selectedNeeds, context } = location.state || { selectedNeeds: [], context: '' }
  
  const [outcome, setOutcome] = useState('')
  const [selectedIntentions, setSelectedIntentions] = useState<string[]>([])
  const [isStarting, setIsStarting] = useState(false)

  const toggleIntention = (intention: string) => {
    setSelectedIntentions(prev => 
      prev.includes(intention) 
        ? prev.filter(i => i !== intention)
        : [...prev, intention]
    )
  }

  const handleStart = async () => {
    setIsStarting(true)
    try {
      // 1. Create the session
      const session = await createSession({
        user_id: MOCK_USER_ID,
        start_time: new Date().toISOString(),
        status: 'in_progress',
        // Optional mock data for development until we build the real input screen
        church_name: 'Sunday Service', 
      })

      // 2. Save the intentions
      const { error } = await supabase.from('intentions').insert({
        session_id: session.id,
        selected_needs: selectedNeeds,
        personal_context: context || null,
        desired_outcome: outcome || null,
        presence_intentions: selectedIntentions
      })

      if (error) throw error

      // 3. Update local state and navigate
      startSession(session)
      navigate('/service')

    } catch (err) {
      console.error('Failed to start session:', err)
      alert('Failed to start session. Please check your connection and try again.')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header flex items-center gap-md">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="subtitle">Step 2 of 2</p>
          <h1>Set Your Intention</h1>
        </div>
      </div>

      <div className="flex-col gap-xl flex-1">
        <section>
          <div className="input-group">
            <label className="input-label">What do you hope to get out of today?</label>
            <textarea 
              className="input-field" 
              rows={3}
              placeholder="E.g., I want to hear God clearly on..."
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
            />
          </div>
        </section>

        <section>
          <div className="input-group">
            <label className="input-label">How will you be present?</label>
            <div className="pill-group">
              {INTENTIONS.map(intention => (
                <button
                  key={intention}
                  className={`pill ${selectedIntentions.includes(intention) ? 'selected' : ''}`}
                  onClick={() => toggleIntention(intention)}
                >
                  {intention}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary"
          onClick={handleStart}
          disabled={isStarting}
        >
          {isStarting ? (
            'Preparing...'
          ) : (
            <>
              Enter Service
              <Play size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
