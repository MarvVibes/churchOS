import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, Compass, User } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  
  // Hide bottom nav on specific screens like Service Mode or Quick Capture
  const hideBottomNav = location.pathname.includes('/service') || location.pathname.includes('/sermon-input');

  return (
    <div className="app-container">
      <div className="screen-container">
        <Outlet />
      </div>

      {!hideBottomNav && (
        <nav className="bottom-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Home size={24} />
            <span>Home</span>
          </NavLink>
          <NavLink 
            to="/journey" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Compass size={24} />
            <span>Journey</span>
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <User size={24} />
            <span>Profile</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default Layout;
