import { NavLink, Link} from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  {
    to: '/', end: true,
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    to: '/tasks',
    label: 'All Tasks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <polyline points="3 6 4 7 6 5"/>
        <polyline points="3 12 4 13 6 11"/>
        <polyline points="3 18 4 19 6 17"/>
      </svg>
    ),
  },
  {
    to: '/tasks/new',
    label: 'New Task',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="16"/>
        <line x1="8"  y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
]

const filterLinks = [
  { to: '/tasks?status=todo', label: 'To Do', dot: 'todo' },
  { to: '/tasks?status=inprogress', label: 'In Progress', dot: 'inprogress' },
  { to: '/tasks?status=done', label: 'Done', dot: 'done' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="sidebar__backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>

        <nav className="sidebar__nav">
          <p className="sidebar__section-label">Menu</p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
              onClick={onClose}
            >
              <span className="sidebar__icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          <p className="sidebar__section-label sidebar__section-label--spaced">Filter by Status</p>
          {filterLinks.map((item) => (
  <Link
    key={item.to}
    to={item.to}
    className="sidebar__link sidebar__filter-link"
    onClick={onClose}
  >
    <span className={`sidebar__dot sidebar__dot--${item.dot}`} />
    {item.label}
  </Link>
))}
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__ai-badge">
            <div className="sidebar__ai-badge-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            </div>
            <div className="sidebar__ai-badge-text">
              <p>AI Powered</p>
              <span>Gemini 1.5 Flash</span>
            </div>
          </div>
        </div>

      </aside>
    </>
  )
}