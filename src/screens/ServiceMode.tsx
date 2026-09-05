import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, StopCircle, Sparkles, BookOpen } from 'lucide-react'
import { useAppStore } from '../store'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'
import { supabase } from '../lib/supabase'

export default function ServiceMode() {
  const navigate = useNavigate()
  const { activeSession, addManualNote } = useAppStore()
  
  // Custom speech hook
  const { 
    isListening, 
    transcript, 
    interimTranscript, 
    startListening, 
    stopListening,
    error,
    isSupported
  } = useSpeechRecognition()

  const [elapsedTime, setElapsedTime] = useState(0)
  const [manualNoteText, setManualNoteText] = useState('')
  const [mockAiInsights, setMockAiInsights] = useState<{type: 'verse' | 'point', text: string}[]>([])

  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Timer
  useEffect(() => {
    if (!activeSession) {
      navigate('/')
      return
    }

    const start = new Date(activeSession.start_time).getTime()
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - start) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [activeSession, navigate])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [transcript, interimTranscript])

  // Mock AI Engine Simulator (generates fake insights as transcript grows)
  useEffect(() => {
    if (transcript.length > 50 && mockAiInsights.length === 0) {
      setTimeout(() => {
        setMockAiInsights(prev => [...prev, { type: 'point', text: 'Theme detected: Faith and Perseverance' }])
      }, 2000)
    }
    if (transcript.length > 150 && mockAiInsights.length === 1) {
      setTimeout(() => {
        setMockAiInsights(prev => [...prev, { type: 'verse', text: 'James 1:3 - Knowing this, that the trying of your faith worketh patience.' }])
      }, 2000)
    }
  }, [transcript, mockAiInsights.length])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const handleEndService = async () => {
    if (!activeSession) return
    
    // Save any pending manual note
    if (manualNoteText.trim()) {
      addManualNote(manualNoteText.trim())
    }

    // Stop microphone
    stopListening()

    try {
      // 1. Update session status and end time, and save the full transcript!
      await supabase
        .from('service_sessions')
        .update({ 
          status: 'completed',
          end_time: new Date().toISOString()
          // Note: In a real app we would add a 'transcript' column to service_sessions and save it here.
          // For the MVP demo, we will just pass it in state or context to the next screen.
        })
        .eq('id', activeSession.id)

      navigate('/end', { state: { fullTranscript: transcript } })
    } catch (err) {
      console.error('Failed to end service', err)
      alert('Failed to end service. Please try again.')
    }
  }

  if (!isSupported) {
    return (
      <div className="state-center text-danger h-full">
        <p>Speech recognition is not supported in this browser.</p>
        <p className="text-sm mt-sm text-2">Please use Google Chrome for the automated recording features.</p>
      </div>
    )
  }

  return (
    <div className="flex-col h-full bg-bg" style={{ minHeight: '100vh', position: 'relative', margin: '-var(--space-lg)', padding: '0' }}>
      
      {/* Top Header */}
      <div className="flex items-center justify-between p-md bg-surface border-b border-border z-10 sticky top-0">
        <div className="flex items-center gap-sm">
          {isListening ? (
            <button onClick={stopListening} className="btn-icon bg-danger bg-opacity-20 border-danger text-danger rounded-full">
              <Mic size={18} />
            </button>
          ) : (
            <button onClick={startListening} className="btn-icon bg-surface-2 rounded-full">
              <MicOff size={18} />
            </button>
          )}
          <div className="flex-col">
            <span className="text-sm font-bold">{isListening ? 'Recording Live' : 'Paused'}</span>
            <span className="text-xs text-danger font-mono tracking-wider">{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <button 
          onClick={handleEndService}
          className="flex items-center gap-xs px-md py-sm bg-surface-2 border border-border rounded-full text-xs font-bold uppercase tracking-widest hover:border-danger hover:text-danger transition-all"
        >
          <StopCircle size={16} />
          End
        </button>
      </div>

      {error && (
        <div className="p-sm bg-danger text-white text-xs text-center">{error}</div>
      )}

      {/* Main Content Split View */}
      <div className="flex-col flex-1 overflow-hidden relative">
        
        {/* Top Half: Live Transcript & AI */}
        <div className="flex-1 overflow-y-auto p-md" style={{ pb: '120px' }}>
          
          <div className="section-header flex items-center gap-sm mb-md text-primary">
            <Sparkles size={14} /> AI Processing Engine
          </div>

          {/* Transcript Feed */}
          <div className="text-sm text-2 leading-relaxed mb-xl">
            {transcript.length === 0 && !isListening && (
              <p className="opacity-50 italic">Tap the microphone to start recording the service...</p>
            )}
            {transcript}
            <span className="opacity-50 italic"> {interimTranscript}</span>
            <div ref={transcriptEndRef} />
          </div>

          {/* Mock AI Insights Feed */}
          {mockAiInsights.length > 0 && (
            <div className="flex-col gap-sm mt-xl mb-xl border-t border-border pt-md">
              <p className="text-xs font-bold uppercase tracking-widest text-3 mb-xs">Live Insights</p>
              {mockAiInsights.map((insight, idx) => (
                <div key={idx} className="card py-sm px-md flex items-start gap-md animate-slide-up border-primary-dim bg-primary-soft" style={{ backgroundColor: 'var(--color-primary-dim)' }}>
                  {insight.type === 'verse' ? <BookOpen size={16} className="text-primary mt-1" /> : <Sparkles size={16} className="text-accent mt-1" />}
                  <p className="text-sm">{insight.text}</p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Bottom Half: Manual Notes */}
        <div className="bg-surface border-t border-border p-md z-10 sticky bottom-0">
          <p className="text-xs font-bold uppercase tracking-widest text-3 mb-sm">My Personal Notes</p>
          <textarea 
            className="input-field" 
            rows={3}
            placeholder="Type anything here... it won't interrupt the AI recording."
            value={manualNoteText}
            onChange={(e) => setManualNoteText(e.target.value)}
            style={{ resize: 'none', background: 'var(--color-bg)' }}
          />
        </div>

      </div>

    </div>
  )
}
