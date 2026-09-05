import { useState, useEffect, ReactNode } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { StopCircle, Zap, Book, MessageCircle, CheckSquare, Lightbulb } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'
import QuickCaptureModal from '../components/QuickCaptureModal'

type Category = 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action'

const CATEGORY_CONFIG: Record<Category, { icon: ReactNode, color: string, label: string }> = {
  insight: { icon: <Lightbulb size={20} />, color: 'var(--color-primary)', label: 'Insight' },
  powerful_moment: { icon: <Zap size={20} />, color: 'var(--color-accent)', label: 'Moment' },
  scripture: { icon: <Book size={20} />, color: '#60a5fa', label: 'Scripture' },
  question: { icon: <MessageCircle size={20} />, color: '#fbbf24', label: 'Question' },
  action: { icon: <CheckSquare size={20} />, color: '#34d399', label: 'Action' }
}

export default function ServiceMode() {
  const navigate = useNavigate()
  const { activeSession, activeCaptures, addCapture } = useAppStore()
  
  const [elapsed, setElapsed] = useState(0)
  const [activeModal, setActiveModal] = useState<Category | null>(null)

  // Timer logic
  useEffect(() => {
    if (!activeSession) return
    const startTime = new Date(activeSession.start_time).getTime()
    
    const updateTimer = () => {
      const now = new Date().getTime()
      setElapsed(Math.floor((now - startTime) / 1000))
    }
    
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [activeSession])

  // Protect route
  if (!activeSession) {
    return <Navigate to="/" replace />
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleSaveCapture = async (content: string) => {
    if (!activeModal || !activeSession) return

    try {
      // Optimistic save
      const captureData = {
        session_id: activeSession.id,
        category: activeModal,
        content,
        timestamp_seconds: elapsed
      }

      const { data, error } = await supabase
        .from('captured_moments')
        .insert(captureData)
        .select()
        .single()

      if (error) throw error
      addCapture(data)
      setActiveModal(null)
    } catch (err) {
      console.error('Failed to save capture:', err)
      alert('Failed to save. Please try again.')
    }
  }

  return (
    <div className="flex-col h-full bg-bg" style={{ minHeight: '100vh', padding: 'var(--space-lg)', position: 'relative' }}>
      
      {/* Header / Timer */}
      <div className="flex justify-between items-center mb-xl mt-sm">
        <div className="flex items-center gap-sm">
          <div className="live-dot" />
          <span className="font-bold tracking-widest text-sm" style={{ color: 'var(--color-danger)' }}>
            LIVE
          </span>
        </div>
        <div className="text-2xl font-bold font-mono tracking-wider">
          {formatTime(elapsed)}
        </div>
      </div>

      <div className="text-center mb-xl">
        <h2 className="text-3xl font-bold mb-xs">{activeSession.church_name || 'Sunday Service'}</h2>
        <p className="text-2">{new Date(activeSession.start_time).toLocaleDateString()}</p>
      </div>

      {/* Capture Grid */}
      <div className="grid gap-md" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: 'var(--space-xl)' }}>
        {(Object.entries(CATEGORY_CONFIG) as [Category, typeof CATEGORY_CONFIG[Category]][]).map(([key, config]) => (
          <button
            key={key}
            className="card card-interactive flex-col items-center justify-center gap-sm"
            style={{ padding: 'var(--space-xl) var(--space-md)', borderColor: config.color }}
            onClick={() => setActiveModal(key)}
          >
            <div style={{ color: config.color }}>{config.icon}</div>
            <span className="font-bold text-sm">{config.label}</span>
          </button>
        ))}
      </div>

      {/* Timeline (Recent Captures) */}
      <div className="flex-1">
        <div className="section-header">Timeline</div>
        {activeCaptures.length === 0 ? (
          <div className="state-center text-3 py-xl">
            <p className="text-sm">Tap a category above to capture a moment.</p>
          </div>
        ) : (
          <div className="scroll-list">
            {[...activeCaptures].sort((a, b) => b.timestamp_seconds - a.timestamp_seconds).map(capture => {
              const config = CATEGORY_CONFIG[capture.category]
              return (
                <div key={capture.id} className="card py-sm px-md flex items-start gap-md">
                  <div className="mt-xs" style={{ color: config.color }}>
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-1">{capture.content}</p>
                    <p className="text-xs text-3 mt-xs">{formatTime(capture.timestamp_seconds)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* End Service Button */}
      <div className="sticky bottom-0 pt-lg pb-md" style={{ background: 'linear-gradient(to bottom, transparent, var(--color-bg) 30%)' }}>
        <button 
          className="btn btn-secondary w-full"
          onClick={() => navigate('/end')}
        >
          <StopCircle size={18} />
          End Service
        </button>
      </div>

      {/* Capture Modal Overlay */}
      <QuickCaptureModal 
        category={activeModal}
        onClose={() => setActiveModal(null)}
        onSave={handleSaveCapture}
      />
    </div>
  )
}
