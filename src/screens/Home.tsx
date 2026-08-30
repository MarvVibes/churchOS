import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { fetchRecentSessions, generateDemoDataIfNeeded } from '../lib/services';
import type { Database } from '../types/supabase';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

type ServiceSession = Database['public']['Tables']['service_sessions']['Row'];

const MOCK_USER_ID = 'mock-user-123'; // In a real app, this comes from auth

const Home = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();
  const [recentSessions, setRecentSessions] = useState<ServiceSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState('00:00');

  useEffect(() => {
    const loadData = async () => {
      await generateDemoDataIfNeeded(MOCK_USER_ID);
      const sessions = await fetchRecentSessions(MOCK_USER_ID);
      setRecentSessions(sessions);
      setIsLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (activeSession && activeSession.status === 'in_progress') {
      const interval = setInterval(() => {
        const start = new Date(activeSession.start_time).getTime();
        const now = Date.now();
        const diff = Math.floor((now - start) / 1000);
        
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        
        if (hours > 0) {
          setDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        } else {
          setDuration(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeSession]);

  return (
    <div className="home-container">
      <header className="mb-6">
        <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>Sunday OS</p>
        <h1>Good morning, Alex</h1>
        <p>Every message is an opportunity for transformation.</p>
      </header>

      {activeSession && activeSession.status === 'in_progress' ? (
        <section className="mb-6">
          <div className="card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Your service is in progress</h2>
            <div className="flex items-center gap-2 mb-4 text-secondary">
              <Clock size={16} />
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{duration}</span>
            </div>
            <button 
              className="btn btn-primary w-full"
              onClick={() => navigate('/service')}
            >
              CONTINUE SERVICE
            </button>
          </div>
        </section>
      ) : (
        <section className="mb-6">
          <div className="card" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'inherit' }}>Ready for today's service?</h2>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Prepare your heart. Capture what matters. Live what you learn.</p>
            <button 
              className="btn w-full mt-4" 
              style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-primary)' }}
              onClick={() => navigate('/start-session')}
            >
              START MY SUNDAY
            </button>
          </div>
        </section>
      )}

      <section>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Recent Journey</h2>
        {isLoading ? (
          <p>Loading journey...</p>
        ) : recentSessions.length > 0 ? (
          <div className="flex-col gap-4">
            {recentSessions.map(session => (
              <div 
                key={session.id} 
                className="card" 
                style={{ padding: '16px', cursor: 'pointer', marginBottom: '12px' }}
                onClick={() => navigate(`/session/${session.id}`)}
              >
                <div className="text-secondary" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {format(new Date(session.date), 'MMMM d')}
                </div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{session.sermon_title || 'Untitled Sermon'}</h3>
                <div className="text-secondary" style={{ fontSize: '0.9rem' }}>
                  {session.status === 'completed' ? 'Completed' : 'In Progress'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center" style={{ padding: '32px 16px' }}>
            <p>You have not completed a Sunday session yet.</p>
            <p style={{ fontSize: '0.9rem' }}>Your journey begins with your next message.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
