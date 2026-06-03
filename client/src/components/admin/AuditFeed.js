export default function AuditFeed({ events = [] }) {
  return (
    <section className="admin-panel">
      <h2>Recent audit activity</h2>
      <ul className="admin-audit-feed">
        {events.map((event) => (
          <li key={`${event._id}-${event.createdAt}`}>
            <strong>{event.action}</strong>
            <span>
              {event.actor?.username || 'system'} · {event.resourceType} ·{' '}
              {new Date(event.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
