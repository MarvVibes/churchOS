import { useState  } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { createSession } from '../lib/services';
import { supabase } from '../lib/supabase';

const PRESENCE_OPTIONS = [
  'Fully Present',
  'Open-Minded',
  'Reflective',
  'Ready to Act'
];

const MOCK_USER_ID = 'mock-user-123'; // Real app uses auth

const SetIntention = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { startSession } = useAppStore();
  
  const previousState = location.state as { selectedNeeds: string[], mindContext: string } | null;
  
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [presenceIntentions, setPresenceIntentions] = useState<string[]>([]);
  const [isStarting, setIsStarting] = useState(false);

  const togglePresence = (presence: string) => {
    setPresenceIntentions(prev => 
      prev.includes(presence) ? prev.filter(p => p !== presence) : [...prev, presence]
    );
  };

  const handleEnterService = async () => {
    setIsStarting(true);
    try {
      // 1. Create the session in Supabase (or mock)
      const newSession = await createSession({
        user_id: MOCK_USER_ID,
        date: new Date().toISOString(),
        church_name: null,
        preacher_name: null,
        sermon_title: null,
        start_time: new Date().toISOString(),
        end_time: null,
        status: 'in_progress',
      });

      // 2. Save intentions
      await supabase.from('intentions').insert({
        session_id: newSession.id,
        selected_needs: previousState?.selectedNeeds || [],
        personal_context: previousState?.mindContext || null,
        desired_outcome: desiredOutcome,
        presence_intentions: presenceIntentions
      });

      // 3. Update global state
      startSession(newSession);

      // 4. Navigate
      navigate('/service', { replace: true });
    } catch (err) {
      console.error('Failed to start session', err);
      setIsStarting(false);
    }
  };

  return (
    <div className="flex-col h-full">
      <header className="mb-6 mt-4">
        <h1 className="mb-2">Set Your Intention</h1>
      </header>

      <section className="flex-1">
        <div className="input-group">
          <label className="input-label" style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
            By the end of today's service, what would make you say, "That was exactly what I needed?"
          </label>
          <textarea 
            className="input-field" 
            placeholder="I want clarity about what I should focus on this week."
            value={desiredOutcome}
            onChange={(e) => setDesiredOutcome(e.target.value)}
          />
        </div>

        <div className="mb-8 mt-8">
          <label className="input-label mb-4" style={{ fontSize: '1.1rem' }}>
            How do you want to show up today?
          </label>
          <div className="selectable-list">
            {PRESENCE_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`selectable-pill ${presenceIntentions.includes(opt) ? 'selected' : ''}`}
                onClick={() => togglePresence(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-auto pt-4">
        <button 
          className="btn btn-primary w-full"
          onClick={handleEnterService}
          disabled={desiredOutcome.trim() === '' || presenceIntentions.length === 0 || isStarting}
        >
          {isStarting ? 'STARTING...' : 'ENTER SERVICE MODE'}
        </button>
      </div>
    </div>
  );
};

export default SetIntention;
