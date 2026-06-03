import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { searchPosts } from '../services/blogApi';

export default function SearchPage() {
  const [params] = useSearchParams();
  const term = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    searchPosts(term)
      .then((payload) => setResults(payload.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [term]);

  return (
    <section>
      <h1>Search results</h1>
      <p>Query: {term || '(empty)'}</p>
      {loading ? <p>Searching...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      {results.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
}
