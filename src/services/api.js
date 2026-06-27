import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor — handle 401 / token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('refresh_token')
        if (!refresh) throw new Error('No refresh token')
        const res = await axios.post(`${BASE_URL}/accounts/token/refresh/`, { refresh })
        localStorage.setItem('access_token', res.data.access)
        original.headers.Authorization = `Bearer ${res.data.access}`
        return api(original)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// ── Tasks API ──
export const tasksAPI = {
  getAll: (params) => api.get('/tasks/', { params }),
  getOne: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post('/tasks/', data),
  update: (id, data) => api.put(`/tasks/${id}/`, data),
  patch: (id, data) => api.patch(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`),
  getStats: () => api.get('/tasks/stats/'),
  reorder: (orderedIds) => api.post('/tasks/reorder/', { ordered_ids: orderedIds }),
}

// ── Auth API ──
export const authAPI = {
  login: (data) => api.post('/accounts/login/', data),
  register: (data) => api.post('/accounts/register/', data),
  logout: (data) => api.post('/accounts/logout/', data),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.put('/accounts/profile/', data),
}

// ── AI API ──
export const aiAPI = {
  suggest: (title) => api.post('/ai/suggest/', { title }),
}

export default api
