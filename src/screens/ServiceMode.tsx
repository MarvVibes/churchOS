import { useState, useEffect  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { Lightbulb, Flame, BookOpen, HelpCircle, Target, Mic, List } from 'lucide-react';
import QuickCaptureModal from '../components/QuickCaptureModal';

type Category = 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action';

const CAPTURE_BUTTONS: { category: Category; icon: React.ReactNode; label: string; desc: string }[] = [
  { category: 'insight', icon: <Lightbulb size={24} />, label: 'INSIGHT', desc: 'Something just became clear' },
  { category: 'powerful_moment', icon: <Flame size={24} />, label: 'POWERFUL', desc: 'That statement hit deeply' },
  { category: 'scripture', icon: <BookOpen size={24} />, label: 'SCRIPTURE', desc: 'Capture a verse' },
  { category: 'question', icon: <HelpCircle size={24} />, label: 'QUESTION', desc: 'Something to explore' },
  { category: 'action', icon: <Target size={24} />, label: 'ACTION', desc: 'Something I need to do' },
];

const ServiceMode = () => {
  const navigate = useNavigate();
  const { activeSession, activeCaptures, addCapture } = useAppStore();
  
  const [duration, setDuration] = useState('00:00:00');
  const [activeModal, setActiveModal] = useState<Category | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    if (!activeSession || activeSession.status !== 'in_progress') {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(activeSession.start_time).getTime();
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;
      
      setDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeSession, navigate]);

  const handleSaveCapture = async (content: string, category: string) => {
    if (!activeSession) return;
    
    const start = new Date(activeSession.start_time).getTime();
    const timestamp = Math.floor((Date.now() - start) / 1000);
    
    // Create local object
    const newCapture = {
      id: crypto.randomUUID(),
      session_id: activeSession.id,
      category: category as Category,
      content,
      timestamp_seconds: timestamp,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save locally immediately for fast UI
    addCapture(newCapture);

    // Persist to DB asynchronously
    try {
      await supabase.from('captured_moments').insert({
        session_id: activeSession.id,
        category: category as Category,
        content,
        timestamp_seconds: timestamp
      });
    } catch (err) {
      console.error('Failed to sync capture', err);
    }
  };

  const getCaptureCount = (cat: Category) => {
    return activeCaptures.filter(c => c.category === cat).length;
  };

  if (!activeSession) return null;

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      {/* Top Status */}
      <header className="flex justify-between items-center mb-6 mt-2">
        <div className="flex items-center gap-2 text-danger" style={{ fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-danger)', animation: 'pulse 2s infinite' }}></div>
          SERVICE IN PROGRESS
        </div>
        <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: '1.1rem' }}>
          {duration}
        </div>
      </header>

      <section className="flex-1 flex-col">
        <h1 className="text-center mb-8" style={{ fontSize: '1.75rem' }}>What is standing out to you?</h1>

        {/* Capture Buttons */}
        <div className="flex-col gap-4 mb-8">
          {CAPTURE_BUTTONS.map(btn => (
            <button 
              key={btn.category}
              className="card flex items-center justify-between"
              style={{ padding: '16px 24px', margin: 0, cursor: 'pointer', transition: 'transform 0.1s', border: 'none', textAlign: 'left' }}
              onClick={() => setActiveModal(btn.category)}
            >
              <div className="flex items-center gap-4">
                <div style={{ color: 'var(--color-primary)' }}>{btn.icon}</div>
                <div>
                  <div style={{ fontWeight: 600, letterSpacing: '0.05em' }}>{btn.label}</div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{btn.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Counters & Timeline toggle */}
        <div className="card mb-8" style={{ padding: '16px' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 style={{ fontSize: '1rem', margin: 0 }}>Today's Captures</h3>
            <button className="btn-ghost flex items-center gap-1" style={{ padding: '4px 8px', fontSize: '0.85rem' }} onClick={() => setShowTimeline(!showTimeline)}>
              <List size={16} />
              {showTimeline ? 'Hide Timeline' : 'View Timeline'}
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            <div className="text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getCaptureCount('insight')}</div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Insight</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getCaptureCount('powerful_moment')}</div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Powerful</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getCaptureCount('scripture')}</div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Scripture</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getCaptureCount('question')}</div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Question</div>
            </div>
            <div className="text-center">
              <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{getCaptureCount('action')}</div>
              <div className="text-secondary" style={{ fontSize: '0.75rem' }}>Action</div>
            </div>
          </div>
          
          {showTimeline && activeCaptures.length > 0 && (
            <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
              {activeCaptures.map(capture => (
                <div key={capture.id} className="mb-4">
                  <div className="flex items-center gap-2 text-secondary mb-1" style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <span>{new Date(activeSession.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span>•</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{capture.category.replace('_', ' ')}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>"{capture.content}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Actions */}
      <div className="mt-auto flex-col gap-4">
        <button 
          className="btn btn-secondary w-full"
          onClick={() => setActiveModal('insight')} // Assuming voice capture opens insight by default for MVP
        >
          <Mic size={20} />
          Quick Voice Capture
        </button>

        <button 
          className="btn btn-ghost w-full"
          onClick={() => navigate('/end-service')}
          style={{ color: 'var(--color-text-tertiary)', fontSize: '0.9rem' }}
        >
          END SERVICE
        </button>
      </div>

      {activeModal && (
        <QuickCaptureModal 
          category={activeModal} 
          onClose={() => setActiveModal(null)} 
          onSave={handleSaveCapture} 
        />
      )}
    </div>
  );
};

export default ServiceMode;
