import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { tasksAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import TaskCard from '../../components/TaskCard/TaskCard'
import DeleteModal from '../../components/DeleteModal/DeleteModal'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        tasksAPI.getStats(),
        tasksAPI.getAll({ ordering: '-created_at', page_size: 5 }),
      ])
      setStats(statsRes.data)
      setRecentTasks(tasksRes.data.results || tasksRes.data)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await tasksAPI.delete(deleteTarget.id)
      toast.success('Task deleted')
      setDeleteTarget(null)
      loadData()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage text="Loading dashboard…" />

  const firstName = user?.first_name || user?.username || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const greetingEmoji = hour < 12 ? '☀️' : hour < 18 ? '👋' : '🌙'
  const completionRate = stats?.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats?.total ?? 0,
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
    {
      label: 'To Do',
      value: stats?.todo ?? 0,
      gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
    {
      label: 'In Progress',
      value: stats?.inprogress ?? 0,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      ),
    },
    {
      label: 'Completed',
      value: stats?.done ?? 0,
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
    {
      label: 'High Priority',
      value: stats?.high_priority ?? 0,
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
  ]

  const quickActions = [
    {
      to: '/tasks/new',
      cls: 'create',
      title: 'Create Task',
      sub: 'Add a new task with AI',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="16"/>
          <line x1="8" y1="12" x2="16" y2="12"/>
        </svg>
      ),
    },
    {
      to: '/tasks?status=inprogress',
      cls: 'progress',
      title: 'In Progress',
      sub: `${stats?.inprogress || 0} active tasks`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="23 4 23 10 17 10"/>
          <polyline points="1 20 1 14 7 14"/>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
      ),
    },
    {
      to: '/tasks?priority=high',
      cls: 'urgent',
      title: 'High Priority',
      sub: `${stats?.high_priority || 0} urgent tasks`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      ),
    },
    {
      to: '/tasks?status=done',
      cls: 'done',
      title: 'Completed',
      sub: `${stats?.done || 0} tasks done`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="dashboard animate-fadeIn">

      {/* ── Hero ── */}
      <div className="dashboard__hero">
        <div className="dashboard__hero-bg" />
        <div className="dashboard__hero-content">
          <div className="dashboard__hero-left">
            <div className="dashboard__greeting-badge">
              <span>{greetingEmoji}</span>
              <span>{greeting}</span>
            </div>
            <h1 className="dashboard__title">
              Welcome back, <span className="dashboard__title-name">{firstName}</span>
            </h1>
            <p className="dashboard__subtitle">
              {stats?.todo > 0
                ? `You have ${stats.todo} task${stats.todo > 1 ? 's' : ''} waiting · ${stats?.inprogress || 0} in progress`
                : stats?.total > 0
                  ? '🎉 All tasks completed! Great work.'
                  : 'Ready to be productive? Create your first task.'}
            </p>

            {/* Mini stats row inside hero */}
            <div className="dashboard__hero-stats">
              <div className="dashboard__hero-stat">
                <span className="dashboard__hero-stat-val">{stats?.total ?? 0}</span>
                <span className="dashboard__hero-stat-label">Total</span>
              </div>
              <div className="dashboard__hero-stat-divider" />
              <div className="dashboard__hero-stat">
                <span className="dashboard__hero-stat-val">{stats?.todo ?? 0}</span>
                <span className="dashboard__hero-stat-label">To Do</span>
              </div>
              <div className="dashboard__hero-stat-divider" />
              <div className="dashboard__hero-stat">
                <span className="dashboard__hero-stat-val">{stats?.inprogress ?? 0}</span>
                <span className="dashboard__hero-stat-label">In Progress</span>
              </div>
              <div className="dashboard__hero-stat-divider" />
              <div className="dashboard__hero-stat">
                <span className="dashboard__hero-stat-val">{stats?.done ?? 0}</span>
                <span className="dashboard__hero-stat-label">Done</span>
              </div>
            </div>
          </div>

          <div className="dashboard__hero-right">
            <div className="dashboard__progress-ring-wrap">
              <svg className="dashboard__progress-ring" viewBox="0 0 84 84">
                <circle cx="42" cy="42" r="34" fill="none"
                  stroke="rgba(255,255,255,0.15)" strokeWidth="6"/>
                <circle cx="42" cy="42" r="34" fill="none"
                  stroke="white" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - completionRate / 100)}`}
                  transform="rotate(-90 42 42)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="dashboard__progress-label">
                <span className="dashboard__progress-pct">{completionRate}%</span>
                <span className="dashboard__progress-sub">Done</span>
              </div>
            </div>

            <Link to="/tasks/new" className="dashboard__new-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="dashboard__stats">
        {statCards.map((card) => (
          <div key={card.label} className="dashboard__stat-card">
            <div className="dashboard__stat-top">
              <div className="dashboard__stat-icon" style={{ background: card.gradient }}>
                {card.icon}
              </div>
              <p className="dashboard__stat-value">{card.value}</p>
            </div>
            <p className="dashboard__stat-label">{card.label}</p>
            <div className="dashboard__stat-bar">
              <div
                className="dashboard__stat-bar-fill"
                style={{
                  width: stats?.total > 0
                    ? `${Math.min((card.value / stats.total) * 100, 100)}%`
                    : '0%',
                  background: card.gradient,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ── */}
      <div className="dashboard__quick-actions">
        {quickActions.map((qa) => (
          <Link key={qa.to} to={qa.to} className={`dashboard__qa dashboard__qa--${qa.cls}`}>
            <div className="dashboard__qa-icon">{qa.icon}</div>
            <div>
              <p className="dashboard__qa-title">{qa.title}</p>
              <p className="dashboard__qa-sub">{qa.sub}</p>
            </div>
            <svg className="dashboard__qa-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        ))}
      </div>

      {/* ── Recent Tasks ── */}
      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <div>
            <h2 className="dashboard__section-title">Recent Tasks</h2>
            <p className="dashboard__section-sub">Your latest activity</p>
          </div>
          <Link to="/tasks" className="dashboard__view-all">
            View all tasks
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="dashboard__empty">
            <div className="dashboard__empty-icon">
              <svg viewBox="0 0 64 64" fill="none">
                <rect x="8" y="10" width="48" height="44" rx="6"
                  fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2"/>
                <line x1="18" y1="24" x2="46" y2="24"
                  stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="32" x2="38" y2="32"
                  stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="18" y1="40" x2="30" y2="40"
                  stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="10" fill="var(--color-primary)"/>
                <line x1="50" y1="45" x2="50" y2="55"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                <line x1="45" y1="50" x2="55" y2="50"
                  stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="dashboard__empty-title">No tasks yet</p>
            <p className="dashboard__empty-desc">
              Create your first task and let AI help you!
            </p>
            <Link to="/tasks/new" className="dashboard__empty-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create First Task
            </Link>
          </div>
        ) : (
          <div className="dashboard__task-list">
            {recentTasks.map(task => (
              <TaskCard key={task.id} task={task} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </div>

      <DeleteModal
        task={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}