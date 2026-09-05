import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'

export default function SermonInput() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [title, setTitle] = useState(activeSession?.sermon_title || '')
  const [preacher, setPreacher] = useState(activeSession?.preacher_name || '')
  const [transcript, setTranscript] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!activeSession) {
    navigate('/')
    return null
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // 1. Update session with metadata if provided
      if (title || preacher) {
        await supabase
          .from('service_sessions')
          .update({ 
            sermon_title: title || null,
            preacher_name: preacher || null 
          })
          .eq('id', activeSession.id)
      }

      // 2. Save transcript/notes
      if (transcript.trim()) {
        await supabase
          .from('sermon_content')
          .insert({
            session_id: activeSession.id,
            title: title || null,
            preacher: preacher || null,
            transcript: transcript.trim(),
            source_type: 'notes'
          })
      }

      // Proceed to processing
      navigate('/processing')

    } catch (err) {
      console.error('Failed to save sermon input:', err)
      alert('Failed to save. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Post-Service</p>
        <h1>Sermon Details</h1>
      </div>

      <div className="flex-col gap-xl flex-1">
        <section className="input-group">
          <label className="input-label">Sermon Title (Optional)</label>
          <input 
            type="text"
            className="input-field" 
            placeholder="e.g., The Power of Faith"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>

        <section className="input-group">
          <label className="input-label">Preacher (Optional)</label>
          <input 
            type="text"
            className="input-field" 
            placeholder="e.g., Pastor John"
            value={preacher}
            onChange={(e) => setPreacher(e.target.value)}
          />
        </section>

        <section className="input-group">
          <div className="flex justify-between items-center mb-xs">
            <label className="input-label mb-0">Sermon Notes or Transcript</label>
            <span className="label-xs text-primary flex items-center gap-xs">
              <Sparkles size={12} /> AI Analyzed
            </span>
          </div>
          <textarea 
            className="input-field" 
            rows={8}
            placeholder="Paste the sermon transcript here, or type your raw notes. Our AI will analyze this along with your captured moments."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </section>
      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Process with AI'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}
