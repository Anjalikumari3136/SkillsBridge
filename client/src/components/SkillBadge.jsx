// client/src/components/SkillBadge.jsx
/**
 * variant: 'has' | 'want' | 'missing' | 'neutral'
 */
export default function SkillBadge({ name, variant = 'neutral' }) {
  return (
    <span className={`skill-badge ${variant}`} title={`${name} – ${variant}`}>
      <span className="skill-dot" aria-hidden="true" />
      {name}
    </span>
  );
}
