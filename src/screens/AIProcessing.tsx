import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Network, CheckCircle, Calendar, BookOpen } from 'lucide-react'
import { useAppStore } from '../store'

const PROCESSING_STEPS = [
  { label: 'Analyzing live transcript...', icon: <Brain size={24} /> },
  { label: 'Extracting theological themes...', icon: <Network size={24} /> },
  { label: 'Cross-referencing Bible verses...', icon: <BookOpen size={24} /> },
  { label: 'Building your 7-Day Study Schedule...', icon: <Calendar size={24} /> },
  { label: 'Aligning with Life Categories...', icon: <CheckCircle size={24} /> }
]

export default function AIProcessing() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!activeSession) {
      navigate('/')
      return
    }

    const runMockAnalysis = async () => {
      // Animate through stages
      for (let i = 0; i < PROCESSING_STEPS.length - 1; i++) {
        await new Promise(r => setTimeout(r, 1500))
        setStepIndex(i + 1)
      }

      // Wait a second on the "Done" stage before navigating
      await new Promise(r => setTimeout(r, 1000))
      
      // Navigate to the Daily Engine / Study Schedule
      navigate('/schedule')
    }

    runMockAnalysis()
  }, [activeSession, navigate])

  const currentStep = PROCESSING_STEPS[stepIndex]

  return (
    <div className="flex-col h-full items-center justify-center text-center px-lg bg-surface">
      <div className="relative mb-xl">
        <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-full" />
        <div className="w-24 h-24 rounded-full bg-surface-2 border border-border flex items-center justify-center text-primary relative z-10 mx-auto">
          {currentStep.icon}
        </div>
      </div>

      <h2 className="mb-sm text-xl">Theological AI Engine</h2>
      <p className="text-2 mb-2xl">{currentStep.label}</p>

      <div className="w-full max-w-xs h-2 bg-surface-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-in-out"
          style={{ width: `${((stepIndex + 1) / PROCESSING_STEPS.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
