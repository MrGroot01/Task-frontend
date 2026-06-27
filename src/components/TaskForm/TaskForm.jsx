import { useState } from 'react'
import { aiAPI } from '../../services/api'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import './TaskForm.css'

const INITIAL = {
  title: '',
  description: '',
  due_date: '',
  priority: 'medium',
  status: 'todo',
}

export default function TaskForm({ initialData = {}, onSubmit, submitting, submitLabel = 'Save Task' }) {
  const [form, setForm] = useState({ ...INITIAL, ...initialData })
  const [errors, setErrors] = useState({})
  const [aiLoading, setAiLoading] = useState(false)
  const [aiSuggested, setAiSuggested] = useState(false)

  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }))
    if (field === 'title') setAiSuggested(false)
  }

  const validate = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (form.due_date && new Date(form.due_date) < new Date(new Date().toDateString())) {
      // allow past dates — just a note
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleAISuggest = async () => {
    if (!form.title.trim()) {
      toast.error('Enter a task title first')
      return
    }
    setAiLoading(true)
    try {
      const res = await aiAPI.suggest(form.title)
      const { title, description, priority } = res.data
      setForm(f => ({ ...f, title, description, priority }))
      setAiSuggested(true)
      toast.success('AI suggestion applied!')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    const payload = { ...form }
    if (!payload.due_date) delete payload.due_date
    onSubmit(payload)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      {/* Title + AI Suggest */}
      <div className="task-form__group">
        <label className="task-form__label" htmlFor="title">
          Task Title <span className="task-form__required">*</span>
        </label>
        <div className="task-form__title-row">
          <input
            id="title"
            type="text"
            className={`task-form__input ${errors.title ? 'task-form__input--error' : ''}`}
            placeholder="e.g. Fix login bug, Write quarterly report…"
            value={form.title}
            onChange={e => set('title', e.target.value)}
          />
          <button
            type="button"
            className={`task-form__ai-btn ${aiLoading ? 'task-form__ai-btn--loading' : ''} ${aiSuggested ? 'task-form__ai-btn--done' : ''}`}
            onClick={handleAISuggest}
            disabled={aiLoading}
            title="Let AI write a full description and suggest priority"
          >
            {aiLoading ? (
              <LoadingSpinner size="sm" />
            ) : aiSuggested ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Applied
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                AI Suggest
              </>
            )}
          </button>
        </div>
        {errors.title && <p className="task-form__error">{errors.title}</p>}
        {aiSuggested && (
          <p className="task-form__ai-hint">
            ✨ AI filled in the description and priority. Review and edit before saving.
          </p>
        )}
      </div>

      {/* Description */}
      <div className="task-form__group">
        <label className="task-form__label" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="task-form__textarea"
          placeholder="Describe what needs to be done…"
          value={form.description}
          onChange={e => set('description', e.target.value)}
          rows={4}
        />
      </div>

      {/* Row: Due date, Priority, Status */}
      <div className="task-form__row">
        <div className="task-form__group">
          <label className="task-form__label" htmlFor="due_date">Due Date</label>
          <input
            id="due_date"
            type="date"
            className="task-form__input"
            value={form.due_date}
            onChange={e => set('due_date', e.target.value)}
          />
        </div>

        <div className="task-form__group">
          <label className="task-form__label" htmlFor="priority">Priority</label>
          <select
            id="priority"
            className={`task-form__select task-form__select--${form.priority}`}
            value={form.priority}
            onChange={e => set('priority', e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="task-form__group">
          <label className="task-form__label" htmlFor="status">Status</label>
          <select
            id="status"
            className="task-form__select"
            value={form.status}
            onChange={e => set('status', e.target.value)}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="task-form__footer">
        <button type="submit" className="task-form__submit" disabled={submitting}>
          {submitting ? (
            <>
              <LoadingSpinner size="sm" />
              Saving…
            </>
          ) : submitLabel}
        </button>
      </div>
    </form>
  )
}
