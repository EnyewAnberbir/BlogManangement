import Post from '../Post';
import { useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api';
import { UserContext } from '../UserContext';

export default function IndexPage() {
  const [posts, setPosts] = useState([]);
  const { setUiError } = useContext(UserContext);

  useEffect(() => {
    apiRequest('/post')
      .then((allPosts) => {
        setPosts(allPosts);
        setUiError('');
      })
      .catch((error) => setUiError(error.message));
  }, [setUiError]);

  return <>{posts.length > 0 && posts.map((post) => <Post key={post._id} {...post} />)}</>;
}
