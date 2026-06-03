import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPostRevisions, restorePostRevision } from '../services/blogApi';

export default function PostRevisionsPage() {
  const { id } = useParams();
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restoring, setRestoring] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPostRevisions(id)
      .then((rows) => setRevisions(rows))
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function onRestore(revisionNumber) {
    setRestoring(revisionNumber);
    setMessage('');
    try {
      await restorePostRevision(id, revisionNumber);
      setMessage(`Restored revision ${revisionNumber}.`);
      const rows = await fetchPostRevisions(id);
      setRevisions(rows);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRestoring(null);
    }
  }

  if (loading) return <p>Loading revision history...</p>;

  return (
    <section>
      <h1>Revision history</h1>
      <p>
        <Link to={`/post/${id}`}>Back to post</Link>
      </p>
      {message ? <p>{message}</p> : null}
      {revisions.length === 0 ? (
        <p>No revisions stored yet.</p>
      ) : (
        <ul className="revision-list">
          {revisions.map((revision) => (
            <li key={revision._id} className="revision-item">
              <div>
                <strong>#{revision.revisionNumber}</strong> · {revision.title}
              </div>
              <p>{revision.summary}</p>
              <small>
                {revision.editor?.username || 'unknown'} · {revision.status} ·{' '}
                {new Date(revision.createdAt).toLocaleString()}
              </small>
              <button
                type="button"
                disabled={restoring === revision.revisionNumber}
                onClick={() => onRestore(revision.revisionNumber)}
              >
                {restoring === revision.revisionNumber ? 'Restoring...' : 'Restore'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
