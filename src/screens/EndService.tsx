import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
const EndService = () => {
  const navigate = useNavigate();
  const { activeCaptures, endSession } = useAppStore();

  const getCaptureCount = (category: string) => {
    return activeCaptures.filter(c => c.category === category).length;
  };

  const handleContinue = () => {
    endSession();
    navigate('/sermon-input');
  };

  return (
    <div className="flex-col h-full items-center justify-center text-center">
      <header className="mb-8 w-full">
        <h1 className="mb-2">Service Complete?</h1>
      </header>

      <section className="card w-full mb-8 text-left">
        <h3 className="mb-4" style={{ fontSize: '1.1rem' }}>Today's Summary</h3>
        <div className="flex-col gap-3">
          <div className="flex justify-between">
            <span className="text-secondary">Insights</span>
            <span style={{ fontWeight: 600 }}>{getCaptureCount('insight')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Powerful Moments</span>
            <span style={{ fontWeight: 600 }}>{getCaptureCount('powerful_moment')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Scriptures</span>
            <span style={{ fontWeight: 600 }}>{getCaptureCount('scripture')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Questions</span>
            <span style={{ fontWeight: 600 }}>{getCaptureCount('question')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Actions</span>
            <span style={{ fontWeight: 600 }}>{getCaptureCount('action')}</span>
          </div>
        </div>
      </section>

      <div className="mb-8">
        <p style={{ fontSize: '1.1rem', color: 'var(--color-text-primary)' }}>
          Are you ready to reflect on today's experience?
        </p>
      </div>

      <div className="mt-auto w-full flex-col gap-4">
        <button 
          className="btn btn-primary w-full"
          onClick={handleContinue}
        >
          YES, CONTINUE
        </button>
        <button 
          className="btn btn-ghost w-full"
          onClick={() => navigate('/service')}
        >
          RETURN TO SERVICE
        </button>
      </div>
    </div>
  );
};

export default EndService;
