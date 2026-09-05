import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'

export default function PersonalReflection() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [reflection, setReflection] = useState({
    remembered_most: '',
    personal_takeaway: '',
    life_application: '',
    potential_change: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!activeSession) {
    navigate('/')
    return null
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await supabase
        .from('reflections')
        .insert({
          session_id: activeSession.id,
          ...reflection
        })

      navigate('/report')
    } catch (err) {
      console.error('Failed to save reflection:', err)
      alert('Failed to save. Please try again.')
      setIsSubmitting(false)
    }
  }

  const isComplete = Object.values(reflection).some(v => v.trim().length > 0)

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Step 1 of 3</p>
        <h1>Personal Reflection</h1>
        <p className="mt-2 text-2">Take a moment to process before seeing the AI summary.</p>
      </div>

      <div className="flex-col gap-xl flex-1">
        <section className="input-group">
          <label className="input-label">What stood out to you the most?</label>
          <textarea 
            className="input-field" 
            rows={3}
            placeholder="A specific phrase, scripture, or moment..."
            value={reflection.remembered_most}
            onChange={(e) => setReflection(prev => ({ ...prev, remembered_most: e.target.value }))}
          />
        </section>

        <section className="input-group">
          <label className="input-label">What is your biggest personal takeaway?</label>
          <textarea 
            className="input-field" 
            rows={3}
            placeholder="How does this speak to your current situation?"
            value={reflection.personal_takeaway}
            onChange={(e) => setReflection(prev => ({ ...prev, personal_takeaway: e.target.value }))}
          />
        </section>
      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !isComplete}
        >
          {isSubmitting ? 'Saving...' : 'View Sermon Report'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}
