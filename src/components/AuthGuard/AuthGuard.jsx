import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

export default function AuthGuard() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner fullPage />
  return user ? <Outlet /> : <Navigate to="/login" replace />
}
