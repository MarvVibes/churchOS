import { useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { Upload } from 'lucide-react';

const SermonInput = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();

  const [transcript, setTranscript] = useState('');
  const [title, setTitle] = useState('');
  const [preacher, setPreacher] = useState('');
  const [church, setChurch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnalyze = async () => {
    if (!activeSession) return;
    setIsSubmitting(true);

    try {
      // Save transcript
      await supabase.from('sermon_content').insert({
        session_id: activeSession.id,
        title: title || null,
        preacher: preacher || null,
        church: church || null,
        transcript: transcript || null,
        source_type: 'text'
      });
      
      navigate('/processing');
    } catch (err) {
      console.error('Failed to save sermon input', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '20px' }}>
      <header className="mb-6 mt-4">
        <h1 className="mb-2">Add Today's Message</h1>
        <p>Help Sunday OS understand the message you just experienced.</p>
      </header>

      <section className="flex-1 overflow-y-auto" style={{ paddingRight: '4px', marginRight: '-4px' }}>
        <div className="mb-6">
          <label className="input-label">Audio Recording (Optional)</label>
          <div className="card flex-col items-center justify-center text-center" style={{ borderStyle: 'dashed', padding: '32px 16px', cursor: 'pointer', backgroundColor: 'transparent' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', padding: '12px', borderRadius: '50%', marginBottom: '12px' }}>
              <Upload size={24} className="text-secondary" />
            </div>
            <div style={{ fontWeight: 500, marginBottom: '4px' }}>Upload Audio</div>
            <div className="text-secondary" style={{ fontSize: '0.85rem' }}>MP3, WAV, or M4A</div>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Paste Transcript or Notes</label>
          <textarea 
            className="input-field" 
            style={{ minHeight: '180px' }}
            placeholder="Paste the sermon transcript, your notes, or a summary..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Optional Details</h3>
          
          <div className="input-group mb-4">
            <label className="input-label">Sermon Title</label>
            <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          
          <div className="input-group mb-4">
            <label className="input-label">Preacher Name</label>
            <input type="text" className="input-field" value={preacher} onChange={e => setPreacher(e.target.value)} />
          </div>
          
          <div className="input-group mb-4">
            <label className="input-label">Church Name</label>
            <input type="text" className="input-field" value={church} onChange={e => setChurch(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="mt-4 pt-4 bg-background">
        <button 
          className="btn btn-primary w-full"
          onClick={handleAnalyze}
          disabled={isSubmitting || transcript.trim() === ''}
        >
          {isSubmitting ? 'SAVING...' : 'ANALYZE MESSAGE'}
        </button>
      </div>
    </div>
  );
};

export default SermonInput;
