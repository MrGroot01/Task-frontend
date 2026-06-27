import './StatsCard.css'

export default function StatsCard({ label, value, icon, color, bg, trend }) {
  return (
    <div className="stats-card animate-fadeIn">
      <div className="stats-card__icon" style={{ background: bg, color }}>
        {icon}
      </div>
      <div className="stats-card__body">
        <p className="stats-card__value">{value ?? '—'}</p>
        <p className="stats-card__label">{label}</p>
      </div>
      {trend !== undefined && (
        <div className={`stats-card__trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}
