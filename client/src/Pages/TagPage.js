import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../services/blogApi';

export default function TagPage() {
  const { slug } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPosts(`withMeta=true&tag=${encodeURIComponent(slug)}&page=1&limit=20`)
      .then((payload) => setPosts(payload.items || []))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <section>
      <h1>Posts tagged: {slug}</h1>
      {loading ? <p>Loading...</p> : null}
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </section>
  );
}
