export default function LeaderboardTable({ rows = [] }) {
  return (
    <section className="admin-panel">
      <h2>Author leaderboard</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Author</th>
            <th>Posts</th>
            <th>Views</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.author?._id || row.author?.username}>
              <td>{row.author?.displayName || row.author?.username || 'Unknown'}</td>
              <td>{row.posts}</td>
              <td>{row.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
