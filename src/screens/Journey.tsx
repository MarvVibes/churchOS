import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchRecentSessions } from '../lib/services';
import type { Database } from '../types/supabase';
import { format } from 'date-fns';

type ServiceSession = Database['public']['Tables']['service_sessions']['Row'];

const MOCK_USER_ID = 'mock-user-123';

const Journey = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<ServiceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchRecentSessions(MOCK_USER_ID);
      setSessions(data || []);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="flex-col h-full">
      <header className="mb-6 mt-4">
        <h1 className="mb-2">Your Journey</h1>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        {isLoading ? (
          <p>Loading journey...</p>
        ) : sessions.length > 0 ? (
          <div className="flex-col gap-4">
            {sessions.map(session => (
              <div 
                key={session.id} 
                className="card" 
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/session/${session.id}`)}
              >
                <div style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
                  {format(new Date(session.date), 'MMMM d, yyyy')}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>{session.sermon_title || 'Untitled Sermon'}</h3>
                
                <div className="flex items-center justify-between text-secondary" style={{ fontSize: '0.85rem' }}>
                  <div className="flex items-center gap-2">
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: session.status === 'completed' ? 'var(--color-success)' : 'var(--color-warning)' }}></span>
                    {session.status.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '32px 16px' }}>
            <p>You have not completed a Sunday session yet.</p>
            <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>Your journey begins with your next message.</p>
            <button className="btn btn-primary w-full" onClick={() => navigate('/start-session')}>
              START MY SUNDAY
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Journey;
