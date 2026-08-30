import { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
const NEEDS_OPTIONS = [
  'Direction',
  'Clarity',
  'Encouragement',
  'Strength',
  'Wisdom',
  'Peace',
  'Understanding',
  'Something Else'
];

const StartSession = () => {
  const navigate = useNavigate();
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [mindContext, setMindContext] = useState('');

  const toggleNeed = (need: string) => {
    setSelectedNeeds(prev => 
      prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]
    );
  };

  const handleContinue = () => {
    // In a real app we might pass this state via router state or store it in context/zustand temporarily
    // until the session is fully started. For now, we'll use router state.
    navigate('/set-intention', { 
      state: { selectedNeeds, mindContext } 
    });
  };

  return (
    <div className="flex-col h-full">
      <header className="mb-6 mt-4">
        <h1 className="mb-2">Before We Begin</h1>
        <p>Take a moment to become intentional.</p>
      </header>

      <section className="flex-1">
        <div className="mb-8">
          <label className="input-label mb-4" style={{ fontSize: '1.1rem' }}>What are you hoping to receive today?</label>
          <div className="selectable-list">
            {NEEDS_OPTIONS.map(need => (
              <button
                key={need}
                className={`selectable-pill ${selectedNeeds.includes(need) ? 'selected' : ''}`}
                onClick={() => toggleNeed(need)}
              >
                {need}
              </button>
            ))}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Is there anything on your mind?</label>
          <textarea 
            className="input-field" 
            placeholder="I need clarity about my next step..."
            value={mindContext}
            onChange={(e) => setMindContext(e.target.value)}
          />
        </div>
      </section>

      <div className="mt-auto pt-4">
        <button 
          className="btn btn-primary w-full"
          onClick={handleContinue}
          disabled={selectedNeeds.length === 0 && mindContext.trim() === ''}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
};

export default StartSession;
