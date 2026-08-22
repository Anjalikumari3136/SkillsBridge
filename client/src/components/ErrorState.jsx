// client/src/components/ErrorState.jsx
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-state" role="alert">
      <div className="icon">⚠️</div>
      <h3>Something went wrong</h3>
      <p>{message || 'Unable to connect to the graph database. Please try again.'}</p>
      {onRetry && (
        <button className="btn btn-ghost btn-sm" onClick={onRetry} id="btn-retry">
          ↺ Retry
        </button>
      )}
    </div>
  );
}
