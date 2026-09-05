import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft } from 'lucide-react'

const COMMON_NEEDS = [
  'Guidance', 'Peace', 'Healing', 'Direction', 
  'Clarity', 'Rest', 'Strength', 'Breakthrough'
]

export default function StartSession() {
  const navigate = useNavigate()
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [context, setContext] = useState('')

  const toggleNeed = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) 
        ? prev.filter(n => n !== need)
        : [...prev, need]
    )
  }

  const handleNext = () => {
    // Pass state to the next screen via React Router state
    navigate('/set-intention', { 
      state: { selectedNeeds, context } 
    })
  }

  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header flex items-center gap-md">
        <button className="btn-icon" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <p className="subtitle">Step 1 of 2</p>
          <h1>Where are you at?</h1>
        </div>
      </div>

      <div className="flex-col gap-xl flex-1">
        <section>
          <div className="input-group">
            <label className="input-label">What are you seeking today?</label>
            <div className="pill-group">
              {COMMON_NEEDS.map(need => (
                <button
                  key={need}
                  className={`pill ${selectedNeeds.includes(need) ? 'selected' : ''}`}
                  onClick={() => toggleNeed(need)}
                >
                  {need}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="input-group">
            <label className="input-label">What's on your mind? (Optional)</label>
            <textarea 
              className="input-field" 
              rows={4}
              placeholder="E.g., I've been feeling anxious about work..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>
        </section>
      </div>

      <div className="cta-bar mt-auto">
        <button 
          className="btn btn-primary"
          onClick={handleNext}
          disabled={selectedNeeds.length === 0 && context.trim() === ''}
        >
          Next Step
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
