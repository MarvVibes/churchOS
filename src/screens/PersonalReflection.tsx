import { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';

const PersonalReflection = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();

  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const [q4, setQ4] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!activeSession) return;
    setIsSubmitting(true);

    try {
      await supabase.from('reflections').insert({
        session_id: activeSession.id,
        remembered_most: q1,
        personal_takeaway: q2,
        life_application: q3,
        potential_change: q4
      } as any);
      navigate('/report');
    } catch (err) {
      console.error('Failed to save reflections', err);
      setIsSubmitting(false);
    }
  };

  const isFormValid = q1.trim() !== '' && q2.trim() !== ''; // Require at least first two

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      <header className="mb-6 mt-4">
        <h1 className="mb-2" style={{ fontSize: '1.75rem' }}>Before You See the Analysis</h1>
        <p>First, reflect in your own words.</p>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        <div className="input-group mb-6">
          <label className="input-label" style={{ fontSize: '1.1rem' }}>What do you remember most?</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '100px' }}
            value={q1}
            onChange={(e) => setQ1(e.target.value)}
          />
        </div>

        <div className="input-group mb-6">
          <label className="input-label" style={{ fontSize: '1.1rem' }}>What stood out to you personally?</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '100px' }}
            value={q2}
            onChange={(e) => setQ2(e.target.value)}
          />
        </div>

        <div className="input-group mb-6">
          <label className="input-label" style={{ fontSize: '1.1rem' }}>What do you think this message means for your life right now?</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '100px' }}
            value={q3}
            onChange={(e) => setQ3(e.target.value)}
          />
        </div>

        <div className="input-group mb-6">
          <label className="input-label" style={{ fontSize: '1.1rem' }}>What would change if you actually applied this message?</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '100px' }}
            value={q4}
            onChange={(e) => setQ4(e.target.value)}
          />
        </div>
      </section>

      <div className="mt-4 pt-4 bg-background">
        <button 
          className="btn btn-primary w-full"
          onClick={handleContinue}
          disabled={isSubmitting || !isFormValid}
        >
          {isSubmitting ? 'SAVING...' : 'SHOW ME THE BIGGER PICTURE'}
        </button>
      </div>
    </div>
  );
};

export default PersonalReflection;
