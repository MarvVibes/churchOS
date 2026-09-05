import { User, Settings, Shield, LogOut } from 'lucide-react'

export default function Profile() {
  return (
    <div className="animate-fade-in flex-col h-full">
      <div className="page-header">
        <p className="subtitle">Settings</p>
        <h1>Profile</h1>
      </div>

      <div className="flex-col gap-xl">
        <div className="flex items-center gap-md">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl">Believer</h2>
            <p className="text-sm text-2">Joined Sept 2026</p>
          </div>
        </div>

        <div className="flex-col gap-sm">
          <div className="section-header">Account</div>
          <button 
            className="card card-interactive py-md px-md flex items-center gap-md w-full text-left"
            onClick={() => alert('App Settings coming soon!')}
          >
            <Settings size={18} className="text-3" />
            <span className="font-medium text-sm text-1">App Settings</span>
          </button>
          <button 
            className="card card-interactive py-md px-md flex items-center gap-md w-full text-left"
            onClick={() => alert('Privacy & Data coming soon!')}
          >
            <Shield size={18} className="text-3" />
            <span className="font-medium text-sm text-1">Privacy & Data</span>
          </button>
        </div>

        <div className="flex-col gap-sm mt-md">
          <button 
            className="card card-interactive py-md px-md flex items-center gap-md w-full text-left" 
            style={{ borderColor: 'var(--color-danger)' }}
            onClick={() => alert('Sign out coming soon!')}
          >
            <LogOut size={18} className="text-danger" />
            <span className="font-medium text-sm text-danger">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
