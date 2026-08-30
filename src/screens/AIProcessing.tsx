import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { Check, Circle } from 'lucide-react';

const STAGES = [
  'Reading your personal captures',
  'Identifying central themes',
  'Extracting scriptures',
  'Connecting key ideas',
  'Finding powerful moments',
  'Building your Revelation Map'
];

const AIProcessing = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const simulateProcessing = async () => {
      // Simulate staging animation
      for (let i = 0; i < STAGES.length; i++) {
        if (!isMounted) return;
        setCurrentStageIndex(i);
        await new Promise(res => setTimeout(res, 1200)); // 1.2s per stage
      }
      
      if (!isMounted) return;
      setCurrentStageIndex(STAGES.length); // All complete

      // Generate simulated analysis data in DB for this session
      if (activeSession) {
        try {
          await supabase.from('sermon_analysis').insert({
            session_id: activeSession.id,
            main_theme: 'Faith That Moves',
            one_sentence_summary: 'Genuine faith is demonstrated through action, especially when certainty is unavailable.',
            key_ideas: [
              { title: 'Faith Requires Movement', explanation: 'Faith is not a passive waiting game.' },
              { title: 'Waiting Is Not Always Obedience', explanation: 'Sometimes God is waiting on us to take the first step.' },
              { title: 'Action Reveals Belief', explanation: 'What you do shows what you actually believe, more than what you say.' }
            ],
            scriptures: ['James 2:17', 'Hebrews 11:1', 'Genesis 12:1'],
            key_moments: ['"Delayed obedience is still disobedience."']
          });

          // Mock Revelation Map nodes & edges
          await supabase.from('revelation_maps').insert({
            session_id: activeSession.id,
            nodes: [
              { id: 'faith', label: 'FAITH', type: 'main_theme' },
              { id: 'trust', label: 'TRUST', type: 'concept' },
              { id: 'obedience', label: 'OBEDIENCE', type: 'concept' },
              { id: 'waiting', label: 'WAITING', type: 'concept' },
              { id: 'action', label: 'ACTION', type: 'concept' },
              { id: 'james', label: 'James 2:17', type: 'scripture' },
              { id: 'insight1', label: 'Waiting for clarity', type: 'personal_insight' }
            ],
            edges: [
              { source: 'faith', target: 'action' },
              { source: 'faith', target: 'trust' },
              { source: 'trust', target: 'obedience' },
              { source: 'waiting', target: 'action' },
              { source: 'action', target: 'james' },
              { source: 'insight1', target: 'waiting' }
            ]
          });
        } catch (err) {
          console.error('Failed to save mock AI data', err);
        }
      }

      await new Promise(res => setTimeout(res, 1000));
      if (isMounted) {
        navigate('/reflection');
      }
    };

    simulateProcessing();

    return () => { isMounted = false; };
  }, [navigate, activeSession]);

  return (
    <div className="flex-col h-full items-center justify-center text-center">
      <header className="mb-12 w-full">
        <h1 className="mb-2" style={{ fontSize: '1.75rem' }}>Understanding Today's Message</h1>
      </header>

      <div className="flex-col gap-6 text-left w-full max-w-sm mx-auto" style={{ maxWidth: '300px' }}>
        {STAGES.map((stage, index) => {
          const isComplete = index < currentStageIndex;
          const isActive = index === currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div 
              key={stage} 
              className="flex items-center gap-4"
              style={{
                opacity: isPending ? 0.3 : 1,
                transition: 'opacity 0.5s ease',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: 'left center'
              }}
            >
              {isComplete ? (
                <Check size={24} className="text-success" style={{ color: 'var(--color-success)' }} />
              ) : isActive ? (
                <div style={{ position: 'relative', width: '24px', height: '24px' }}>
                  <Circle size={24} style={{ color: 'var(--color-accent)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '50%', border: '2px solid var(--color-accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                </div>
              ) : (
                <Circle size={24} className="text-tertiary" />
              )}
              <span style={{ 
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--color-primary)' : (isComplete ? 'var(--color-text-secondary)' : 'inherit')
              }}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AIProcessing;
