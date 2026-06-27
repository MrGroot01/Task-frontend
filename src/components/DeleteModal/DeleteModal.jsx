import { useEffect } from 'react'
import './DeleteModal.css'

export default function DeleteModal({ task, onConfirm, onCancel, loading }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onCancel()
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onCancel])

  if (!task) return null

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal animate-fadeIn" onClick={e => e.stopPropagation()}>
        <div className="modal__icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4h6v2"/>
          </svg>
        </div>
        <h3 className="modal__title">Delete Task</h3>
        <p className="modal__body">
          Are you sure you want to delete{' '}
          <strong>&ldquo;{task.title}&rdquo;</strong>?{' '}
          This action cannot be undone.
        </p>
        <div className="modal__actions">
          <button className="modal__btn modal__btn--cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="modal__btn modal__btn--danger" onClick={onConfirm} disabled={loading}>
            {loading ? 'Deleting…' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  )
}
