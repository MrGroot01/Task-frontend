import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../../utils/helpers'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [remember, setRemember] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Fill in all fields'); return }
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left animate-fadeIn">
        <div className="auth-brand">
          <div className="auth-brand__icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="2"/>
              <path d="M9 12h6M9 16h4"/>
            </svg>
          </div>
          <span className="auth-brand__name">TaskPro</span>
        </div>

        <h1 className="auth-hero__title">
          Your Tasks,<br />
          <span className="auth-hero__accent">Smarter</span>
        </h1>
        <p className="auth-hero__sub">
          Manage tasks with AI assistance, track progress, and collaborate with your team — all from one place.
        </p>

        <div className="auth-chips">
          {['AI Task Suggestions', 'Smart Deadlines', 'Team Collaboration', 'Progress Reports'].map(c => (
            <div key={c} className="auth-chip"><span className="auth-chip__dot" />{c}</div>
          ))}
        </div>

        <div className="auth-stats">
          <div className="auth-stat"><div className="auth-stat__label">Tasks Today</div><div className="auth-stat__val">12</div><div className="auth-stat__sub">View all</div></div>
          <div className="auth-stat"><div className="auth-stat__label">Completed</div><div className="auth-stat__val">8</div><div className="auth-stat__sub">67% done</div></div>
          <div className="auth-stat"><div className="auth-stat__label">Overdue</div><div className="auth-stat__val">3</div><div className="auth-stat__sub">Review</div></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card animate-fadeIn">
          <div className="auth-card__avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>

          <h2 className="auth-card__title">Welcome back</h2>
          <p className="auth-card__sub">Sign in to continue to your dashboard</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__group">
              <label className="auth-form__label">Username</label>
              <div className="auth-form__wrap">
                <span className="auth-form__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                </span>
                <input className="auth-form__input" type="text" placeholder="your_username"
                  value={form.username} onChange={e => set('username', e.target.value)}
                  autoComplete="username" autoFocus />
              </div>
            </div>

            <div className="auth-form__group">
              <label className="auth-form__label">Password</label>
              <div className="auth-form__wrap">
                <span className="auth-form__ico">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input className="auth-form__input" type={showPass ? 'text' : 'password'}
                  placeholder="••••••••" value={form.password}
                  onChange={e => set('password', e.target.value)} autoComplete="current-password" />
                <button type="button" className="auth-form__eye" onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                  {showPass ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10 10 0 0 1 12 20c-7 0-11-8-11-8a18 18 0 0 1 5.06-5.94M9.9 4.24A9 9 0 0 1 12 4c7 0 11 8 11 8a18 18 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-form__meta">
              <label className="auth-form__remember">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <Link to="/forgot-password" className="auth-form__forgot">Forgot password?</Link>
            </div>

            <button type="submit" className="auth-form__submit" disabled={loading}>
              {loading ? <><LoadingSpinner size="sm" /> Signing in…</> : <>Sign In <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p className="auth-card__footer">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}