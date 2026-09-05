import { Outlet, NavLink } from 'react-router-dom'
import { Home, BookOpen, User } from 'lucide-react'

export default function Layout() {
  return (
    <div className="app-shell">
      <main className="screen">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Home size={22} />
          Home
        </NavLink>

        <NavLink
          to="/journey"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <BookOpen size={22} />
          Journey
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <User size={22} />
          Profile
        </NavLink>
      </nav>
    </div>
  )
}
