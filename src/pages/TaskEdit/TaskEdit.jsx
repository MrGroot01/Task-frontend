import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { tasksAPI } from '../../services/api'
import TaskForm from '../../components/TaskForm/TaskForm'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import './TaskEdit.css'

export default function TaskEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    tasksAPI.getOne(id)
      .then(res => setTask(res.data))
      .catch(err => { toast.error(getErrorMessage(err)); navigate('/tasks') })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handleSubmit = async (data) => {
    setSubmitting(true)
    try {
      await tasksAPI.update(id, data)
      toast.success('Task updated!')
      navigate(`/tasks/${id}`)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage text="Loading task…" />

  return (
    <div className="task-edit animate-fadeIn">
      <div className="task-edit__header">
        <Link to={`/tasks/${id}`} className="task-edit__back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </Link>
        <h1 className="task-edit__title">Edit Task</h1>
      </div>

      <div className="task-edit__card">
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel="Update Task"
        />
      </div>
    </div>
  )
}
