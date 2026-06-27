import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { tasksAPI } from '../../services/api'
import TaskForm from '../../components/TaskForm/TaskForm'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import './TaskCreate.css'

export default function TaskCreate() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      const res = await tasksAPI.create(data)
      toast.success('Task created successfully!')
      navigate(`/tasks/${res.data.id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="task-create animate-fadeIn">

      {/* Hero Banner */}
      <div className="task-create__hero">
        <div className="task-create__hero-bg" />
        <div className="task-create__hero-content">
          <Link to="/tasks" className="task-create__back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Tasks
          </Link>
          <h1 className="task-create__title">Create New Task</h1>
          <p className="task-create__subtitle">
            Fill in the details below or type a rough title and let
            <span className="task-create__ai-tag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              AI Suggest
            </span>
            handle the rest.
          </p>

          <div className="task-create__tips">
            <div className="task-create__tip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              Type a rough title like "fix login bug"
            </div>
            <div className="task-create__tip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              Click AI Suggest to auto-fill description and priority
            </div>
            <div className="task-create__tip">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Review, edit if needed, then save
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="task-create__card">
        <TaskForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create Task" />
      </div>

    </div>
  )
}