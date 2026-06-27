import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__code">404</div>
      <h2 className="notfound__title">Page not found</h2>
      <p className="notfound__desc">The page you're looking for doesn't exist or was moved.</p>
      <Link to="/" className="notfound__btn">Go to Dashboard</Link>
    </div>
  )
}
