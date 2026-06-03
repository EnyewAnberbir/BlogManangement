import { useCallback, useEffect, useState } from 'react';
import { createComment, fetchComments } from '../services/blogApi';

export function useComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchComments(postId);
      const items = Array.isArray(payload) ? payload : payload.items || [];
      setComments(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const submitComment = useCallback(
    async (body) => {
      await createComment(postId, body);
      await reload();
    },
    [postId, reload]
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { comments, loading, error, reload, submitComment };
}
