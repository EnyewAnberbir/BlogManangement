import { useContext, useEffect } from 'react';
import { UserContext } from '../UserContext';
import PostCard from '../components/PostCard';
import { usePosts } from '../hooks/usePosts';

export default function IndexPage() {
  const { setUiError } = useContext(UserContext);
  const { posts, loading, error } = usePosts('withMeta=true&page=1&limit=20');

  useEffect(() => {
    if (error) setUiError(error);
  }, [error, setUiError]);

  if (loading) {
    return <p>Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p>No posts yet. Create the first one.</p>;
  }

  return (
    <section className="post-grid">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
}
