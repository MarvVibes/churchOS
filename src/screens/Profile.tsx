import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const { clearSession } = useAppStore();

  const handleClearDemoData = async () => {
    if (confirm('Are you sure you want to delete all demo data?')) {
      const MOCK_USER_ID = 'mock-user-123';
      try {
        await supabase.from('service_sessions').delete().eq('user_id', MOCK_USER_ID);
        clearSession();
        navigate('/');
      } catch (err) {
        console.error('Failed to clear data', err);
      }
    }
  };

  return (
    <div className="flex-col h-full">
      <header className="mb-6 mt-4">
        <h1 className="mb-2">Profile</h1>
      </header>

      <section className="flex-1 overflow-y-auto">
        <div className="card text-center mb-6" style={{ padding: '32px 16px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-border)', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
            👤
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>Alex</h2>
          <p className="text-secondary">alex@example.com</p>
        </div>

        <div className="mb-6">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Settings</h3>
          <div className="card flex-col gap-4" style={{ padding: '16px' }}>
            <button className="btn btn-secondary w-full justify-between" style={{ padding: '12px 16px' }}>
              <span>Notifications</span>
              <span className="text-secondary">On</span>
            </button>
            <button className="btn btn-secondary w-full justify-between" style={{ padding: '12px 16px' }}>
              <span>Theme</span>
              <span className="text-secondary">System</span>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--color-danger)' }}>Danger Zone</h3>
          <div className="card flex-col gap-4" style={{ padding: '16px', borderColor: 'var(--color-danger)' }}>
            <button className="btn w-full" style={{ backgroundColor: 'var(--color-danger)', color: 'white' }} onClick={handleClearDemoData}>
              Clear All Demo Data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
