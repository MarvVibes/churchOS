import { useState, useEffect  } from 'react';
import { Mic, X, Check } from 'lucide-react';
interface QuickCaptureModalProps {
  category: 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action';
  onClose: () => void;
  onSave: (content: string, category: string) => void;
}

const CATEGORY_QUESTIONS = {
  insight: 'What just became clear?',
  powerful_moment: 'What did you hear that stayed with you?',
  scripture: 'What scripture was mentioned?',
  question: 'What are you wondering about?',
  action: 'What do you feel you need to do?',
};

const QuickCaptureModal: React.FC<QuickCaptureModalProps> = ({ category, onClose, onSave }) => {
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Focus the input when modal opens
  useEffect(() => {
    const textarea = document.getElementById('capture-input');
    if (textarea) {
      textarea.focus();
    }
  }, []);

  const handleSave = () => {
    if (!content.trim()) return;
    
    // Show subtle confirmation before closing
    setShowConfirmation(true);
    setTimeout(() => {
      onSave(content, category);
      onClose();
    }, 400); // Wait for animation
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app with SpeechRecognition API:
      // recognition.stop();
    } else {
      setIsRecording(true);
      // Fallback/mock for MVP
      setTimeout(() => {
        setContent(prev => prev + (prev ? ' ' : '') + 'This is a simulated voice transcription.');
        setIsRecording(false);
      }, 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {showConfirmation ? (
          <div className="flex-col items-center justify-center" style={{ height: '200px' }}>
            <div style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '16px', borderRadius: '50%', marginBottom: '16px' }}>
              <Check size={32} />
            </div>
            <h3>Saved</h3>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{CATEGORY_QUESTIONS[category]}</h2>
              <button className="btn-ghost" onClick={onClose} style={{ padding: '8px', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <textarea
              id="capture-input"
              className="input-field mb-4"
              style={{ minHeight: '150px', fontSize: '1.1rem' }}
              placeholder="Type or speak your thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex justify-between items-center gap-4 mt-2">
              <button 
                className={`btn flex-1 ${isRecording ? 'btn-primary' : 'btn-secondary'}`} 
                style={{ backgroundColor: isRecording ? 'var(--color-danger)' : undefined, color: isRecording ? 'white' : undefined, borderColor: isRecording ? 'var(--color-danger)' : undefined }}
                onClick={toggleRecording}
              >
                <Mic size={20} />
                {isRecording ? 'Listening...' : 'Voice'}
              </button>
              
              <button 
                className="btn btn-primary flex-1" 
                onClick={handleSave}
                disabled={content.trim() === ''}
              >
                SAVE MOMENT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuickCaptureModal;
