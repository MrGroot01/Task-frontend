import { Link } from 'react-router-dom'
import './EmptyState.css'

export default function EmptyState({ filtered = false }) {
  return (
    <div className="empty-state animate-fadeIn">
      <div className="empty-state__illustration">
        <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="140" height="120" rx="12" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2"/>
          <rect x="50" y="45" width="80" height="8" rx="4" fill="var(--color-border)"/>
          <rect x="50" y="62" width="100" height="6" rx="3" fill="var(--color-border-light)"/>
          <rect x="50" y="76" width="60" height="6" rx="3" fill="var(--color-border-light)"/>
          <circle cx="150" cy="120" r="28" fill="var(--color-primary-light)" stroke="var(--color-primary)" strokeWidth="2"/>
          <line x1="150" y1="110" x2="150" y2="130" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
          <line x1="140" y1="120" x2="160" y2="120" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
      <h3 className="empty-state__title">
        {filtered ? 'No tasks match your filters' : 'No tasks yet'}
      </h3>
      <p className="empty-state__desc">
        {filtered
          ? 'Try adjusting your search or filter criteria.'
          : 'Create your first task to get started with TaskPro.'}
      </p>
      {!filtered && (
        <Link to="/tasks/new" className="empty-state__btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create First Task
        </Link>
      )}
    </div>
  )
}
