import { useNavigate } from 'react-router-dom'
import { Calendar, CheckCircle, ArrowRight } from 'lucide-react'
import { useAppStore } from '../store'

export default function StudySchedule() {
  const navigate = useNavigate()
  const { activeSession, clearSession } = useAppStore()

  if (!activeSession) {
    navigate('/')
    return null
  }

  const handleFinish = () => {
    clearSession()
    navigate('/')
  }

  return (
    <div className="animate-fade-in flex-col h-full bg-surface" style={{ minHeight: '100vh', padding: 'var(--space-lg)', position: 'relative' }}>
      <div className="page-header">
        <p className="subtitle">AI Compiled</p>
        <h1>Your 7-Day Study Plan</h1>
        <p className="mt-2 text-2 text-sm">Generated from today's sermon transcript.</p>
      </div>

      <div className="flex-col gap-md flex-1">
        
        {/* Monday */}
        <div className="card p-md border-l-2 border-primary">
          <div className="flex justify-between items-center mb-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Monday</h3>
            <span className="text-xs bg-surface-2 px-sm py-xs rounded-full">Spiritual</span>
          </div>
          <p className="text-sm font-bold mb-sm">The Foundation of Faith</p>
          <div className="flex items-center gap-xs text-2 text-xs">
            <BookOpen size={14} /> Hebrews 11:1-6
          </div>
        </div>

        {/* Tuesday */}
        <div className="card p-md border-l-2" style={{ borderLeftColor: 'var(--color-accent)' }}>
          <div className="flex justify-between items-center mb-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-3">Tuesday</h3>
            <span className="text-xs bg-surface-2 px-sm py-xs rounded-full">Financial</span>
          </div>
          <p className="text-sm font-bold mb-sm">Stewardship in Action</p>
          <div className="flex items-center gap-xs text-2 text-xs">
            <BookOpen size={14} /> Luke 16:10-13
          </div>
        </div>

        {/* Wednesday */}
        <div className="card p-md border-l-2 border-border opacity-70">
          <div className="flex justify-between items-center mb-xs">
            <h3 className="text-sm font-bold uppercase tracking-widest text-3">Wednesday</h3>
            <span className="text-xs bg-surface-2 px-sm py-xs rounded-full">Health</span>
          </div>
          <p className="text-sm font-bold mb-sm">The Temple of the Spirit</p>
        </div>

      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary"
          onClick={handleFinish}
        >
          <CheckCircle size={18} />
          Save & Return Home
        </button>
      </div>
    </div>
  )
}

function BookOpen(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
