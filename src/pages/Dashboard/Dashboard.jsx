import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { tasksAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import StatsCard from '../../components/StatsCard/StatsCard'
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
      label: 'Total Tasks', value: stats?.total ?? 0,
      gradient: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
    },
    {
      label: 'To Do', value: stats?.todo ?? 0,
      gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    },
    {
      label: 'In Progress', value: stats?.inprogress ?? 0,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
    },
    {
      label: 'Completed', value: stats?.done ?? 0,
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    },
    {
      label: 'High Priority', value: stats?.high_priority ?? 0,
      gradient: 'linear-gradient(135deg, #ef4444, #f87171)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    },
  ]

  return (
    <div className="dashboard animate-fadeIn">

      {/* Hero */}
      <div className="dashboard__hero">
        <div className="dashboard__hero-bg" />
        <div className="dashboard__hero-content">
          <div className="dashboard__hero-left">
            <div className="dashboard__greeting-badge">
              <span>{greetingEmoji}</span><span>{greeting}</span>
            </div>
            <h1 className="dashboard__title">
              Welcome back, <span className="dashboard__title-name">{firstName}</span>
            </h1>
            <p className="dashboard__subtitle">
              {stats?.todo > 0
                ? `You have ${stats.todo} task${stats.todo > 1 ? 's' : ''} waiting · ${stats?.inprogress || 0} in progress`
                : stats?.total > 0 ? '🎉 All tasks completed! Great work.' : 'Ready to be productive? Create your first task.'}
            </p>
          </div>
          <div className="dashboard__hero-right">
            <div className="dashboard__progress-ring-wrap">
              <svg className="dashboard__progress-ring" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="white" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 32}`}
                  strokeDashoffset={`${2 * Math.PI * 32 * (1 - completionRate / 100)}`}
                  transform="rotate(-90 40 40)"
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
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Task
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="dashboard__stats">
        {statCards.map((card) => (
          <div key={card.label} className="dashboard__stat-card">
            <div className="dashboard__stat-icon" style={{ background: card.gradient }}>{card.icon}</div>
            <div className="dashboard__stat-body">
              <p className="dashboard__stat-value">{card.value}</p>
              <p className="dashboard__stat-label">{card.label}</p>
            </div>
            <div className="dashboard__stat-bar">
              <div className="dashboard__stat-bar-fill" style={{
                width: stats?.total > 0 ? `${Math.min((card.value / stats.total) * 100, 100)}%` : '0%',
                background: card.gradient,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="dashboard__quick-actions">
        <Link to="/tasks/new" className="dashboard__qa dashboard__qa--create">
          <div className="dashboard__qa-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
          </div>
          <div><p className="dashboard__qa-title">Create Task</p><p className="dashboard__qa-sub">Add a new task with AI</p></div>
        </Link>
        <Link to="/tasks?status=inprogress" className="dashboard__qa dashboard__qa--progress">
          <div className="dashboard__qa-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          </div>
          <div><p className="dashboard__qa-title">In Progress</p><p className="dashboard__qa-sub">{stats?.inprogress || 0} active tasks</p></div>
        </Link>
        <Link to="/tasks?priority=high" className="dashboard__qa dashboard__qa--urgent">
          <div className="dashboard__qa-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div><p className="dashboard__qa-title">High Priority</p><p className="dashboard__qa-sub">{stats?.high_priority || 0} urgent tasks</p></div>
        </Link>
        <Link to="/tasks?status=done" className="dashboard__qa dashboard__qa--done">
          <div className="dashboard__qa-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div><p className="dashboard__qa-title">Completed</p><p className="dashboard__qa-sub">{stats?.done || 0} tasks done</p></div>
        </Link>
      </div>

      {/* Recent Tasks */}
      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <div>
            <h2 className="dashboard__section-title">Recent Tasks</h2>
            <p className="dashboard__section-sub">Your latest activity</p>
          </div>
          <Link to="/tasks" className="dashboard__view-all">
            View all tasks
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="dashboard__empty">
            <div className="dashboard__empty-icon">
              <svg viewBox="0 0 48 48" fill="none">
                <rect x="6" y="8" width="36" height="32" rx="4" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="2"/>
                <line x1="14" y1="18" x2="34" y2="18" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="24" x2="28" y2="24" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                <line x1="14" y1="30" x2="22" y2="30" stroke="var(--color-border)" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="38" cy="36" r="8" fill="var(--color-primary)"/>
                <line x1="38" y1="32" x2="38" y2="40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="34" y1="36" x2="42" y2="36" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="dashboard__empty-title">No tasks yet</p>
            <p className="dashboard__empty-desc">Create your first task and let AI help you!</p>
            <Link to="/tasks/new" className="dashboard__empty-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
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

      <DeleteModal task={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  )
}