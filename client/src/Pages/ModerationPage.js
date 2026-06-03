import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../UserContext';
import { apiRequest } from '../api';

export default function ModerationPage() {
  const { setUiError } = useContext(UserContext);
  const [pendingComments, setPendingComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPendingComments([]);
    setUiError('');
    setLoading(false);
  }, [setUiError]);

  async function moderate(commentId, status) {
    try {
      await apiRequest(`/comments/${commentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      setPendingComments((rows) => rows.filter((row) => row._id !== commentId));
    } catch (error) {
      setUiError(error.message);
    }
  }

  if (loading) return <p>Loading moderation queue...</p>;

  return (
    <section>
      <h1>Moderation queue</h1>
      {pendingComments.length === 0 ? (
        <p>No pending comments right now. Use the admin dashboard for live counts.</p>
      ) : (
        <ul>
          {pendingComments.map((comment) => (
            <li key={comment._id}>
              <p>{comment.body}</p>
              <button type="button" onClick={() => moderate(comment._id, 'approved')}>
                Approve
              </button>
              <button type="button" onClick={() => moderate(comment._id, 'rejected')}>
                Reject
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
