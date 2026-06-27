import './FilterBar.css'

const STATUS_OPTIONS = [
  { value: '',           label: 'All Status' },
  { value: 'todo',       label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done',       label: 'Done' },
  { value: 'cancelled',  label: 'Cancelled' },
]

const PRIORITY_OPTIONS = [
  { value: '',         label: 'All Priority' },
  { value: 'critical', label: 'Critical' },
  { value: 'high',     label: 'High' },
  { value: 'medium',   label: 'Medium' },
  { value: 'low',      label: 'Low' },
]

export default function FilterBar({ search, onSearch, status, onStatus, priority, onPriority }) {
  const hasFilters = search || status || priority

  const clearAll = () => {
    onSearch('')
    onStatus('')
    onPriority('')
  }

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <svg className="filter-bar__search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => onSearch(e.target.value)}
          className="filter-bar__input"
        />
        {search && (
          <button className="filter-bar__clear-x" onClick={() => onSearch('')} aria-label="Clear">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      <div className="filter-bar__selects">
        <div className="filter-bar__select-wrap">
          <select
            className="filter-bar__select"
            value={status}
            onChange={e => onStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <svg className="filter-bar__select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        <div className="filter-bar__select-wrap">
          <select
            className="filter-bar__select"
            value={priority}
            onChange={e => onPriority(e.target.value)}
          >
            {PRIORITY_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <svg className="filter-bar__select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>

        {hasFilters && (
          <button className="filter-bar__clear-all" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}