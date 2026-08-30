import { useEffect, useState  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';

const SessionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>({ isLoading: true });

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      
      const [sessionRes, analysisRes, intentionRes, reflectionRes, commitmentRes, capturesRes] = await Promise.all([
        supabase.from('service_sessions').select('*').eq('id', id).single(),
        supabase.from('sermon_analysis').select('*').eq('session_id', id).single(),
        supabase.from('intentions').select('*').eq('session_id', id).single(),
        supabase.from('reflections').select('*').eq('session_id', id).single(),
        supabase.from('action_commitments').select('*').eq('session_id', id).single(),
        supabase.from('captured_moments').select('*').eq('session_id', id)
      ]);

      setData({
        isLoading: false,
        session: sessionRes.data,
        analysis: analysisRes.data,
        intention: intentionRes.data,
        reflection: reflectionRes.data,
        commitment: commitmentRes.data,
        captures: capturesRes.data || []
      });
    };

    fetchAllData();
  }, [id]);

  if (data.isLoading) return <div className="flex justify-center items-center h-full">Loading details...</div>;
  if (!data.session) return <div className="flex justify-center items-center h-full">Session not found.</div>;

  return (
    <div className="flex-col h-full">
      <header className="mb-6 flex items-center gap-4 mt-2">
        <button className="btn-ghost" style={{ padding: '8px' }} onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="mb-1" style={{ fontSize: '1.25rem' }}>{data.session.sermon_title || 'Session Details'}</h1>
          <div className="text-secondary" style={{ fontSize: '0.85rem' }}>
            {format(new Date(data.session.date), 'MMMM d, yyyy')}
          </div>
        </div>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        
        {data.analysis && (
          <div className="card mb-6" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-background)', border: 'none' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{data.analysis.main_theme}</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>{data.analysis.one_sentence_summary}</p>
          </div>
        )}

        {data.commitment && (
          <div className="mb-6">
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '8px' }}>Action Commitment</h3>
            <div className="card">
              <div style={{ fontSize: '1.1rem', fontWeight: 500, marginBottom: '8px' }}>{data.commitment.action}</div>
              <div className="flex justify-between items-center text-secondary text-sm">
                <span>By: {data.commitment.deadline}</span>
                <span style={{ color: data.commitment.status === 'completed' ? 'var(--color-success)' : 'inherit' }}>
                  {data.commitment.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {data.captures.length > 0 && (
          <div className="mb-6">
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Captured Moments ({data.captures.length})</h3>
            <div className="flex-col gap-3">
              {data.captures.map((cap: any) => (
                <div key={cap.id} className="card" style={{ padding: '12px 16px', margin: 0 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '4px' }}>
                    {cap.category.replace('_', ' ').toUpperCase()}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.95rem' }}>{cap.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.reflection && (
          <div className="mb-6">
            <h3 style={{ fontSize: '0.85rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '8px' }}>Personal Reflection</h3>
            <div className="card" style={{ padding: '16px', margin: 0 }}>
              <div style={{ fontWeight: 500, marginBottom: '4px', fontSize: '0.9rem' }}>What stood out:</div>
              <p style={{ fontSize: '0.95rem', marginBottom: '16px' }}>{data.reflection.personal_takeaway}</p>
              
              <div style={{ fontWeight: 500, marginBottom: '4px', fontSize: '0.9rem' }}>Application:</div>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{data.reflection.potential_change}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SessionDetails;
