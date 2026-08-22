// client/src/components/ResultCard.jsx
export default function ResultCard({ icon, title, subtitle, children, colorClass = 'purple' }) {
  return (
    <div className="card">
      <div className="card-header">
        <div className={`card-icon ${colorClass}`} aria-hidden="true">{icon}</div>
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
