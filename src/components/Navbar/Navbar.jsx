import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import './Navbar.css'

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const initials = user
    ? `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase()
    : 'U'

  return (
    <header className="navbar">
      <div className="navbar__left">
        <button className="navbar__menu-btn" onClick={onMenuClick} aria-label="Toggle sidebar">
          <span /><span /><span />
        </button>
        <Link to="/" className="navbar__brand">
          <svg className="navbar__logo" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="var(--color-primary)" />
            <path d="M8 10h10M8 16h16M8 22h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="24" cy="10" r="3" fill="#a78bfa" />
          </svg>
          <span className="navbar__brand-name">TaskPro</span>
        </Link>
      </div>

      <div className="navbar__right">
        <button
          className="navbar__icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>

        <Link to="/tasks/new" className="navbar__new-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span>New Task</span>
        </Link>

        <div className="navbar__user">
          <button
            className="navbar__avatar"
            onClick={() => setDropdownOpen(o => !o)}
            aria-label="User menu"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown animate-fadeIn">
              <div className="navbar__dropdown-header">
                <p className="navbar__dropdown-name">
                  {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                </p>
                <p className="navbar__dropdown-email">{user?.email}</p>
              </div>
              <div className="navbar__dropdown-divider" />
              <button className="navbar__dropdown-item" onClick={() => { setDropdownOpen(false); logout() }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
