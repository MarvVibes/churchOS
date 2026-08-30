import { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { Calendar } from 'lucide-react';

const DEADLINE_OPTIONS = ['Tomorrow', 'This Week'];

const ActionCommitment = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();

  const [action, setAction] = useState('');
  const [deadline, setDeadline] = useState('This Week');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommit = async () => {
    if (!activeSession) return;
    setIsSubmitting(true);

    try {
      await supabase.from('action_commitments').insert({
        session_id: activeSession.id,
        action,
        deadline,
        reason: reason || null,
        status: 'pending'
      } as any);
      navigate('/final-report');
    } catch (err) {
      console.error('Failed to save commitment', err);
      setIsSubmitting(false);
    }
  };

  const isFormValid = action.trim() !== '';

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      <header className="mb-6 mt-4">
        <h1 className="mb-2" style={{ fontSize: '1.75rem' }}>Don't Leave With Just Notes</h1>
        <p>What is one thing you will actually do?</p>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        <div className="input-group mb-6">
          <label className="input-label" style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>MY ONE ACTION</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '80px', fontSize: '1.25rem', fontWeight: 500 }}
            placeholder="Complete and publish my proposal."
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="input-label mb-4" style={{ fontSize: '1.1rem' }}>When will you do it?</label>
          <div className="selectable-list">
            {DEADLINE_OPTIONS.map(opt => (
              <button
                key={opt}
                className={`selectable-pill ${deadline === opt ? 'selected' : ''}`}
                onClick={() => setDeadline(opt)}
              >
                {opt}
              </button>
            ))}
            <button
              className={`selectable-pill flex items-center gap-2 ${!DEADLINE_OPTIONS.includes(deadline) ? 'selected' : ''}`}
              onClick={() => {
                const date = prompt('Enter a date (e.g., Oct 15):');
                if (date) setDeadline(date);
              }}
            >
              <Calendar size={16} />
              Choose Date
            </button>
          </div>
        </div>

        <div className="input-group mb-8">
          <label className="input-label" style={{ fontSize: '1.1rem' }}>Why does this matter? (Optional)</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '80px' }}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {action && (
          <div className="card mb-4" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)', border: 'none' }}>
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.8 }}>MY COMMITMENT</div>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>I WILL:</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 500 }}>{action}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>BY:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>{deadline}</div>
            </div>
          </div>
        )}
      </section>

      <div className="mt-4 pt-4 bg-background">
        <button 
          className="btn btn-primary w-full"
          onClick={handleCommit}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'SAVING...' : 'COMMIT TO THIS ACTION'}
        </button>
      </div>
    </div>
  );
};

export default ActionCommitment;
