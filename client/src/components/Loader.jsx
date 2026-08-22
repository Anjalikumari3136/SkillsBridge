// client/src/components/Loader.jsx
export default function Loader({ text = 'Loading…' }) {
  return (
    <div className="loader-wrap" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
