import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import '../Login/Login.css'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) { toast.error('Enter your email'); return }
    setLoading(true)
    try {
      await fetch('/api/auth/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      setSent(true)
    } catch {
      toast.error('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-card animate-fadeIn">
        {sent ? (
          <>
            <div className="auth-card__success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <h2 className="auth-card__title">Check your inbox</h2>
            <p className="auth-card__sub">
              We sent a password reset link to <strong>{email}</strong>. Check your spam folder if you don't see it.
            </p>
            <Link to="/login" className="auth-form__submit" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', marginTop: '8px' }}>
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="auth-card__back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Back to sign in
            </Link>
            <h2 className="auth-card__title">Forgot password?</h2>
            <p className="auth-card__sub">Enter your email and we'll send a reset link</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-form__group">
                <label className="auth-form__label">Email address</label>
                <div className="auth-form__wrap">
                  <span className="auth-form__ico">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
                    </svg>
                  </span>
                  <input className="auth-form__input" type="email" placeholder="you@company.com"
                    value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                </div>
              </div>
              <button type="submit" className="auth-form__submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}