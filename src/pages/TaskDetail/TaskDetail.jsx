import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { tasksAPI } from '../../services/api'
import DeleteModal from '../../components/DeleteModal/DeleteModal'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import { formatDate, getPriorityMeta, getStatusMeta, isOverdue } from '../../utils/helpers'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import './TaskDetail.css'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    tasksAPI.getOne(id)
      .then(res => setTask(res.data))
      .catch(err => { toast.error(getErrorMessage(err)); navigate('/tasks') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await tasksAPI.delete(id)
      toast.success('Task deleted')
      navigate('/tasks')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage />
  if (!task) return null

  const priority = getPriorityMeta(task.priority)
  const statusMeta = getStatusMeta(task.status)
  const overdue = isOverdue(task.due_date, task.status)

  return (
    <div className="task-detail animate-fadeIn">
      <div className="task-detail__nav">
        <Link to="/tasks" className="task-detail__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          All Tasks
        </Link>
        <div className="task-detail__actions">
          <Link to={`/tasks/${id}/edit`} className="task-detail__btn task-detail__btn--edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit
          </Link>
          <button className="task-detail__btn task-detail__btn--delete" onClick={() => setShowDelete(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            </svg>
            Delete
          </button>
        </div>
      </div>

      <div className="task-detail__card">
        <div className="task-detail__badges">
          <span className="task-detail__badge" style={{ color: priority.color, background: priority.bg }}>
            {priority.label} Priority
          </span>
          <span className="task-detail__badge" style={{ color: statusMeta.color, background: statusMeta.bg }}>
            {statusMeta.label}
          </span>
          {overdue && (
            <span className="task-detail__badge task-detail__badge--overdue">Overdue</span>
          )}
        </div>

        <h1 className="task-detail__title">{task.title}</h1>

        {task.description ? (
          <p className="task-detail__desc">{task.description}</p>
        ) : (
          <p className="task-detail__no-desc">No description provided.</p>
        )}

        <div className="task-detail__meta-grid">
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Due Date</span>
            <span className={`task-detail__meta-value ${overdue ? 'task-detail__meta-value--danger' : ''}`}>
              {formatDate(task.due_date)}
            </span>
          </div>
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Created</span>
            <span className="task-detail__meta-value">{formatDate(task.created_at)}</span>
          </div>
          <div className="task-detail__meta-item">
            <span className="task-detail__meta-label">Last Updated</span>
            <span className="task-detail__meta-value">{formatDate(task.updated_at)}</span>
          </div>
        </div>
      </div>

      <DeleteModal
        task={showDelete ? task : null}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
        loading={deleting}
      />
    </div>
  )
}
