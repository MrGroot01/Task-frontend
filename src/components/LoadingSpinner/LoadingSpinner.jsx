import './LoadingSpinner.css'

export default function LoadingSpinner({ fullPage = false, size = 'md', text = '' }) {
  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        <div className="spinner-wrap">
          <div className="spinner spinner--lg" />
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    )
  }
  return (
    <div className={`spinner spinner--${size}`} />
  )
}
