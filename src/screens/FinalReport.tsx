import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

const FinalReport = () => {
  const navigate = useNavigate();
  const { activeSession, activeCaptures, clearSession } = useAppStore();
  
  const [data, setData] = useState<any>({ isLoading: true });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!activeSession) return;
      
      const [analysisRes, intentionRes, reflectionRes, commitmentRes] = await Promise.all([
        supabase.from('sermon_analysis').select('*').eq('session_id', activeSession.id).single(),
        supabase.from('intentions').select('*').eq('session_id', activeSession.id).single(),
        supabase.from('reflections').select('*').eq('session_id', activeSession.id).single(),
        supabase.from('action_commitments').select('*').eq('session_id', activeSession.id).single()
      ]);

      setData({
        isLoading: false,
        analysis: analysisRes.data,
        intention: intentionRes.data,
        reflection: reflectionRes.data,
        commitment: commitmentRes.data
      });
    };

    fetchAllData();
  }, [activeSession]);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      clearSession();
      navigate('/journey');
    }, 1500); // simulate saving state / show completion animation briefly
  };

  if (!activeSession) return null;

  if (isSaving) {
    return (
      <div className="flex-col h-full items-center justify-center text-center">
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Sunday Complete.</h2>
        <p className="text-secondary" style={{ fontSize: '1.1rem' }}>The real experience begins with what you do next.</p>
      </div>
    );
  }

  if (data.isLoading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  const durationStr = activeSession.end_time ? (() => {
    const start = new Date(activeSession.start_time).getTime();
    const end = new Date(activeSession.end_time).getTime();
    const diff = Math.floor((end - start) / 60000); // minutes
    return `${diff} minutes`;
  })() : 'Unknown';

  const getCaptureCount = (cat: string) => activeCaptures.filter(c => c.category === cat).length;

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      <header className="mb-8 mt-4 text-center">
        <div style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>
          YOUR SUNDAY
        </div>
        <h1 style={{ fontSize: '1.75rem' }}>{format(new Date(activeSession.date), 'MMMM d, yyyy')}</h1>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        
        {/* Service Experience */}
        <div className="mb-8">
          <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
            Service Experience
          </h3>
          <div className="flex-col gap-2" style={{ fontSize: '0.95rem' }}>
            <div className="flex justify-between">
              <span className="text-secondary">Duration</span>
              <span style={{ fontWeight: 500 }}>{durationStr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Insights Captured</span>
              <span style={{ fontWeight: 500 }}>{getCaptureCount('insight')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Powerful Moments</span>
              <span style={{ fontWeight: 500 }}>{getCaptureCount('powerful_moment')}</span>
            </div>
          </div>
        </div>

        {/* The Message */}
        {data.analysis && (
          <div className="mb-8">
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              The Message
            </h3>
            <div className="card" style={{ padding: '16px', margin: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '8px' }}>{data.analysis.main_theme}</div>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>{data.analysis.one_sentence_summary}</p>
            </div>
          </div>
        )}

        {/* What Stood Out */}
        {activeCaptures.length > 0 && (
          <div className="mb-8">
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              What Stood Out To You
            </h3>
            <div className="card" style={{ padding: '16px', margin: 0, borderLeft: '3px solid var(--color-primary)' }}>
              <p style={{ margin: 0, fontStyle: 'italic', fontSize: '1.05rem' }}>"{activeCaptures[0].content}"</p>
            </div>
          </div>
        )}

        {/* Your Commitment */}
        {data.commitment && (
          <div className="mb-8">
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
              Your Commitment
            </h3>
            <div className="card" style={{ padding: '16px', margin: 0, backgroundColor: 'var(--color-primary)', color: 'var(--color-background)', border: 'none' }}>
              <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>ACTION:</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '12px' }}>{data.commitment.action}</div>
              <div className="flex justify-between items-center text-sm" style={{ opacity: 0.8 }}>
                <span>Deadline: {data.commitment.deadline}</span>
                <span>Status: {data.commitment.status.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="mt-4 pt-4 bg-background">
        <button 
          className="btn btn-primary w-full"
          onClick={handleSave}
        >
          SAVE MY SUNDAY
        </button>
      </div>
    </div>
  );
};

export default FinalReport;
