import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Network, CheckCircle } from 'lucide-react'
import { useAppStore } from '../store'
import { supabase } from '../lib/supabase'
import type { Json } from '../types/supabase'

const STAGES = [
  { id: 'extract', label: 'Extracting key themes...', icon: <Brain size={24} /> },
  { id: 'map', label: 'Mapping relationships...', icon: <Network size={24} /> },
  { id: 'synthesize', label: 'Synthesizing your captures...', icon: <Sparkles size={24} /> },
  { id: 'done', label: 'Analysis complete', icon: <CheckCircle size={24} /> }
]

export default function AIProcessing() {
  const navigate = useNavigate()
  const { activeSession } = useAppStore()
  
  const [stageIndex, setStageIndex] = useState(0)

  useEffect(() => {
    if (!activeSession) {
      navigate('/')
      return
    }

    const runMockAnalysis = async () => {
      // Animate through stages
      for (let i = 0; i < STAGES.length - 1; i++) {
        await new Promise(r => setTimeout(r, 1500))
        setStageIndex(i + 1)
      }

      // Write mock analysis to DB
      try {
        await supabase.from('sermon_analysis').insert({
          session_id: activeSession.id,
          main_theme: "The Power of Faith in Action",
          one_sentence_summary: "Faith is not just a belief, it is a verb that requires us to move even when we cannot see the entire staircase.",
          key_ideas: [
            "Faith requires movement, not just mental agreement.",
            "Doubt is a normal part of the process, but it shouldn't dictate your actions.",
            "God's timing often contradicts our expectations."
          ] as Json,
          scriptures: [
            { reference: "Hebrews 11:1", text: "Now faith is the assurance of things hoped for, the conviction of things not seen." },
            { reference: "James 2:17", text: "So also faith by itself, if it does not have works, is dead." }
          ] as Json,
          key_moments: [] as Json
        })

        // Wait a second on the "Done" stage before navigating
        await new Promise(r => setTimeout(r, 1000))
        navigate('/reflection')

      } catch (err) {
        console.error('Failed mock analysis:', err)
        navigate('/reflection') // proceed anyway for testing
      }
    }

    runMockAnalysis()
  }, [activeSession, navigate])

  const currentStage = STAGES[stageIndex]

  return (
    <div className="flex-col h-full items-center justify-center text-center px-lg bg-surface">
      <div className="relative mb-xl">
        <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-full" />
        <div className="relative z-10 w-24 h-24 rounded-full bg-surface-2 border border-border flex items-center justify-center text-primary">
          {currentStage.icon}
        </div>
      </div>

      <h2 className="mb-sm text-primary">AI is working</h2>
      <p className="text-2 transition-all duration-300">
        {currentStage.label}
      </p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs h-2 bg-surface-2 rounded-full mt-xl overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
        />
      </div>
    </div>
  )
}
