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
      <div className="task-create__header">
        <Link to="/tasks" className="task-create__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </Link>
        <h1 className="task-create__title">Create New Task</h1>
        <p className="task-create__subtitle">
          Fill in the details below. Use{' '}
          <strong>AI Suggest</strong> to auto-generate a description and priority.
        </p>
      </div>

      <div className="task-create__card">
        <TaskForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create Task" />
      </div>
    </div>
  )
}
