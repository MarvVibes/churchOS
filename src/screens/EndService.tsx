import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'
import { useAppStore } from '../store'

export default function EndService() {
  const navigate = useNavigate()
  const location = useLocation()
  const { activeSession, manualNotes, endSession } = useAppStore()

  if (!activeSession) {
    navigate('/')
    return null
  }

  const handleEnd = () => {
    endSession()
    navigate('/processing', { state: { fullTranscript: location.state?.fullTranscript || '' } })
  }

  return (
    <div className="animate-fade-in flex-col h-full items-center justify-center text-center px-lg">
      <div className="mb-xl">
        <h1 className="mb-sm">End Service?</h1>
        <p className="text-2">You have {manualNotes.length} manual notes saved.</p>
        <p className="text-2 mt-xs text-sm italic opacity-70 border border-border p-sm rounded-md bg-surface mt-md text-left">
          Snippet: "{location.state?.fullTranscript?.substring(0, 100)}..."
        </p>
        <p className="text-2 mt-md font-bold">Ready to compile the Study Schedule?</p>
      </div>

      <div className="flex-col gap-md w-full max-w-sm">
        <button className="btn btn-primary" onClick={handleEnd}>
          <CheckCircle size={18} />
          Yes, End Service
        </button>
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <XCircle size={18} />
          Cancel, return to service
        </button>
      </div>
    </div>
  )
}
