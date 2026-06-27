import { format, isAfter, parseISO, isValid } from 'date-fns'

export const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  const d = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  if (!isValid(d)) return '—'
  return format(d, 'MMM d, yyyy')
}

export const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'done') return false
  const d = parseISO(dateStr)
  return isAfter(new Date(), d)
}

export const getPriorityMeta = (priority) => {
  const map = {
    high: { label: 'High', color: 'var(--color-high)', bg: 'var(--color-high-bg)' },
    medium: { label: 'Medium', color: 'var(--color-medium)', bg: 'var(--color-medium-bg)' },
    low: { label: 'Low', color: 'var(--color-low)', bg: 'var(--color-low-bg)' },
  }
  return map[priority] || map.medium
}

export const getStatusMeta = (status) => {
  const map = {
    todo: { label: 'To Do', color: 'var(--color-todo)', bg: 'var(--color-todo-bg)' },
    inprogress: { label: 'In Progress', color: 'var(--color-inprogress)', bg: 'var(--color-inprogress-bg)' },
    done: { label: 'Done', color: 'var(--color-done)', bg: 'var(--color-done-bg)' },
  }
  return map[status] || map.todo
}

export const getErrorMessage = (error) => {
  if (error?.response?.data) {
    const data = error.response.data
    if (typeof data === 'string') return data
    const msgs = Object.values(data).flat()
    return msgs[0] || 'Something went wrong.'
  }
  return error?.message || 'Something went wrong.'
}
