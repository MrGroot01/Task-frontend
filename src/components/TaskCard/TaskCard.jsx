import { Link } from 'react-router-dom'
import { formatDate, isOverdue, getPriorityMeta, getStatusMeta } from '../../utils/helpers'
import './TaskCard.css'

export default function TaskCard({ task, onDelete, provided }) {
  const priority = getPriorityMeta(task.priority)
  const statusMeta = getStatusMeta(task.status)
  const overdue = isOverdue(task.due_date, task.status)

  return (
    <div
      className={`task-card ${overdue ? 'task-card--overdue' : ''}`}
      ref={provided?.innerRef}
      {...(provided?.draggableProps || {})}
    >
      {/* Drag handle */}
      {provided && (
        <div className="task-card__drag" {...provided.dragHandleProps} title="Drag to reorder">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
            <circle cx="7"  cy="4"  r="1.5"/>
            <circle cx="7"  cy="10" r="1.5"/>
            <circle cx="7"  cy="16" r="1.5"/>
            <circle cx="13" cy="4"  r="1.5"/>
            <circle cx="13" cy="10" r="1.5"/>
            <circle cx="13" cy="16" r="1.5"/>
          </svg>
        </div>
      )}

      <div className="task-card__body">
        <div className="task-card__badges">
          <span
            className="task-card__badge"
            style={{ color: priority.color, background: priority.bg, border: `1px solid ${priority.color}30` }}
          >
            {priority.label}
          </span>
          <span
            className="task-card__badge"
            style={{ color: statusMeta.color, background: statusMeta.bg, border: `1px solid ${statusMeta.color}30` }}
          >
            {statusMeta.label}
          </span>
          {overdue && (
            <span className="task-card__badge task-card__badge--overdue">
              ⚠ Overdue
            </span>
          )}
        </div>

        <Link to={`/tasks/${task.id}`} className="task-card__title">
          {task.title}
        </Link>

        {task.description && (
          <p className="task-card__desc">{task.description}</p>
        )}

        <div className="task-card__meta">
          {task.due_date && (
            <span className={`task-card__date ${overdue ? 'task-card__date--overdue' : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
              </svg>
              {formatDate(task.due_date)}
            </span>
          )}
          <span className="task-card__created">
            Created {formatDate(task.created_at)}
          </span>
        </div>
      </div>

      <div className="task-card__actions">
        <Link to={`/tasks/${task.id}/edit`} className="task-card__action-btn" title="Edit task">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </Link>
        <button
          className="task-card__action-btn task-card__action-btn--danger"
          onClick={() => onDelete(task)}
          title="Delete task"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    </div>
  )
}