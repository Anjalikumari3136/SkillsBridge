// client/src/components/EmptyState.jsx
export default function EmptyState({ icon = '🔍', title = 'No results', message }) {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
