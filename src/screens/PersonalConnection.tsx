import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type Intention = Database['public']['Tables']['intentions']['Row'];

const PersonalConnection = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();
  const [intention, setIntention] = useState<Intention | null>(null);

  useEffect(() => {
    const fetchIntention = async () => {
      if (!activeSession) return;
      const { data } = await supabase
        .from('intentions')
        .select('*')
        .eq('session_id', activeSession.id)
        .single();
      
      if (data) setIntention(data);
    };
    fetchIntention();
  }, [activeSession]);

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      <header className="mb-8 mt-4 text-center">
        <h1 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>What This Could Mean For You</h1>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        
        <div className="mb-8">
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
            You Came Looking For
          </h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
            "{intention?.desired_outcome || 'I want clarity about what I should focus on this week.'}"
          </p>
        </div>

        <div className="mb-8">
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '8px' }}>
            A Pattern Worth Noticing
          </h3>
          <div className="card" style={{ backgroundColor: 'var(--color-accent-soft)', border: 'none' }}>
            <p style={{ margin: 0, color: 'var(--color-text-primary)', lineHeight: 1.6 }}>
              Several moments you captured focused on movement, delayed action, and obedience before certainty.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
            A Possible Connection
          </h3>
          <p style={{ lineHeight: 1.6 }}>
            You came seeking clarity about your next step. A recurring theme in the message was that clarity sometimes develops through movement rather than waiting for complete certainty.
          </p>
          <p style={{ lineHeight: 1.6, marginTop: '16px' }}>
            This reflection is based on your notes and today's message. Only you can determine how it applies to your life.
          </p>
        </div>

      </section>

      <div className="mt-4 pt-4 bg-background">
        <button 
          className="btn btn-primary w-full"
          onClick={() => navigate('/commitment')}
        >
          CHOOSE YOUR ACTION
        </button>
      </div>
    </div>
  );
};

export default PersonalConnection;
