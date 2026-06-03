export default function TrendList({ title, rows = [] }) {
  return (
    <section className="admin-panel">
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p>No activity in this period.</p>
      ) : (
        <ul className="admin-trend-list">
          {rows.map((row) => (
            <li key={row.date}>
              <span>{row.date}</span>
              <strong>{row.count}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
