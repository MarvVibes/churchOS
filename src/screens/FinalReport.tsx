import { useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle } from 'lucide-react'
import { useAppStore } from '../store'

export default function FinalReport() {
  const navigate = useNavigate()
  const { activeSession, clearSession } = useAppStore()

  if (!activeSession) {
    navigate('/')
    return null
  }

  const handleFinish = () => {
    // This clears the active session from Zustand
    // The DB records are already written.
    clearSession()
    navigate('/journey')
  }

  return (
    <div className="animate-fade-in flex-col h-full items-center justify-center text-center px-lg bg-surface">
      
      <div className="mb-xl">
        <CheckCircle size={48} className="text-success mx-auto mb-md" />
        <h1>Sunday Saved.</h1>
        <p className="text-2 mt-sm">
          Your insights, reflections, and commitments have been safely stored in your journey.
        </p>
      </div>

      <div className="card w-full mb-xl">
        <div className="flex items-center justify-center gap-sm text-3 mb-xs">
          <Calendar size={14} />
          <span className="text-xs font-bold uppercase tracking-wider">Date</span>
        </div>
        <p className="font-bold text-lg">
          {new Date(activeSession.start_time).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="cta-bar w-full">
        <button 
          className="btn btn-primary"
          onClick={handleFinish}
        >
          View My Journey
        </button>
      </div>
      
    </div>
  )
}
