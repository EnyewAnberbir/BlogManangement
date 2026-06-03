import { Link } from 'react-router-dom';

export default function TagPill({ label, slug }) {
  if (!label) return null;
  if (!slug) {
    return <span className="tag-pill">{label}</span>;
  }
  return (
    <Link className="tag-pill" to={`/tag/${slug}`}>
      {label}
    </Link>
  );
}
