export default function CommentList({ comments, loading, error }) {
  if (loading) return <p>Loading comments...</p>;
  if (error) return <p className="error-text">{error}</p>;
  if (!comments.length) return <p>No comments yet.</p>;

  return (
    <ul className="comment-list">
      {comments.map((comment) => (
        <li key={comment._id}>
          <strong>{comment.author?.username || 'anonymous'}</strong>
          <p>{comment.body}</p>
        </li>
      ))}
    </ul>
  );
}
