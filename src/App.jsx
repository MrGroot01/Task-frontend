import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import AuthGuard from './components/AuthGuard/AuthGuard'
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner'

import Dashboard from './pages/Dashboard/Dashboard'
import TaskList from './pages/TaskList/TaskList'
import TaskCreate from './pages/TaskCreate/TaskCreate'
import TaskEdit from './pages/TaskEdit/TaskEdit'
import TaskDetail from './pages/TaskDetail/TaskDetail'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import NotFound from './pages/NotFound/NotFound'

import './App.css'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="app-main">
        <div className="app-content">
          <Routes>
            <Route path="/"              element={<Dashboard />} />
            <Route path="/tasks"         element={<TaskList />} />
            <Route path="/tasks/new"     element={<TaskCreate />} />
            <Route path="/tasks/:id"     element={<TaskDetail />} />
            <Route path="/tasks/:id/edit" element={<TaskEdit />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default function App() {
  const { loading } = useAuth()

  if (loading) return <LoadingSpinner fullPage text="Loading TaskPro…" />

  return (
    <Routes>
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route element={<AuthGuard />}>
        <Route path="/*" element={<AppLayout />} />
      </Route>
    </Routes>
  )
}