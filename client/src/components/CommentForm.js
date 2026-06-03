import { useState } from 'react';

export default function CommentForm({ onSubmit }) {
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = body.trim();
    if (!trimmed) return;

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(trimmed);
      setBody('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Write a comment"
        rows={3}
      />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Posting...' : 'Post comment'}
      </button>
      {error ? <p className="error-text">{error}</p> : null}
    </form>
  );
}
