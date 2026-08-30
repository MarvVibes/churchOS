import { useEffect, useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';

type SermonAnalysis = Database['public']['Tables']['sermon_analysis']['Row'];

const SermonReport = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();
  const [analysis, setAnalysis] = useState<SermonAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (!activeSession) return;
      
      const { data, error } = await supabase
        .from('sermon_analysis')
        .select('*')
        .eq('session_id', activeSession.id)
        .single();
        
      if (error) {
        console.error('Error fetching analysis:', error);
      } else {
        setAnalysis(data);
      }
      setIsLoading(false);
    };
    
    fetchAnalysis();
  }, [activeSession]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading your report...</div>;
  }

  if (!analysis) {
    return <div className="flex justify-center items-center h-full">Analysis not found.</div>;
  }

  // Parse JSON data safely
  const keyIdeas = Array.isArray(analysis.key_ideas) ? analysis.key_ideas : [];
  const scriptures = Array.isArray(analysis.scriptures) ? analysis.scriptures : [];
  const keyMoments = Array.isArray(analysis.key_moments) ? analysis.key_moments : [];

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      <header className="mb-8 mt-4 text-center">
        <div className="text-secondary" style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>The Message</div>
        <h1 style={{ fontSize: '2rem', marginBottom: '16px' }}>{analysis.main_theme}</h1>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        <div className="card text-center mb-8" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)' }}>
          <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', opacity: 0.8 }}>In One Sentence</div>
          <p style={{ fontSize: '1.25rem', lineHeight: 1.4, margin: 0, color: 'inherit' }}>
            {analysis.one_sentence_summary}
          </p>
        </div>

        <div className="mb-8">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Key Ideas</h3>
          <div className="flex-col gap-4">
            {keyIdeas.map((idea: any, idx: number) => (
              <div key={idx} className="flex gap-4">
                <div style={{ color: 'var(--color-text-tertiary)', fontWeight: 600, fontSize: '1.2rem', fontVariantNumeric: 'tabular-nums' }}>
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{idea.title}</h4>
                  <p style={{ margin: 0 }}>{idea.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Scriptures</h3>
          <div className="flex flex-wrap gap-2">
            {scriptures.map((scripture: string, idx: number) => (
              <div key={idx} className="card" style={{ padding: '12px 16px', margin: 0, backgroundColor: 'var(--color-surface-hover)' }}>
                <span style={{ fontWeight: 600 }}>{scripture}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Powerful Moments</h3>
          <div className="flex-col gap-4">
            {keyMoments.map((moment: string, idx: number) => (
              <div key={idx} className="card" style={{ padding: '16px', margin: 0, borderLeft: '3px solid var(--color-primary)' }}>
                <div style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  {moment.startsWith('"') ? 'EXACT QUOTE' : 'KEY IDEA'}
                </div>
                <p style={{ fontSize: '1.1rem', margin: 0, fontStyle: moment.startsWith('"') ? 'italic' : 'normal' }}>
                  {moment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-4 pt-4 bg-background">
        <button 
          className="btn btn-primary w-full"
          onClick={() => navigate('/revelation-map')}
        >
          EXPLORE THE REVELATION MAP
        </button>
      </div>
    </div>
  );
};

export default SermonReport;
