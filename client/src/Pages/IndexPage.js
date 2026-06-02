import Post from '../Post';
import { useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { UserContext } from '../UserContext';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setUiError } = useContext(UserContext);

  useEffect(() => {
    setIsLoading(true);
    apiRequest('/post')
      .then((allPosts) => {
        setPosts(allPosts);
        setUiError('');
      })
      .catch((error) => setUiError(error.message))
      .finally(() => setIsLoading(false));
  }, [setUiError]);

  if (isLoading) {
    return <p>Loading posts...</p>;
  }

  if (posts.length === 0) {
    return <p>No posts yet. Create the first one.</p>;
  }

  return <>{posts.map((post) => <Post key={post._id} {...post} />)}</>;
}
