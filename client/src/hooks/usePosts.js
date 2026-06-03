import { useCallback, useEffect, useState } from 'react';
import { fetchPosts } from '../services/blogApi';

export function usePosts(query = 'withMeta=true&page=1&limit=20') {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = await fetchPosts(query);
      const items = Array.isArray(payload) ? payload : payload.items || [];
      setPosts(items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { posts, loading, error, reload };
}
