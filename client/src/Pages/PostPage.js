import { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatISO9075 } from 'date-fns';
import { UserContext } from '../UserContext';
import { getAssetUrl } from '../api';
import { fetchPost } from '../services/blogApi';
import { useComments } from '../hooks/useComments';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo, setUiError } = useContext(UserContext);
  const { id } = useParams();
  const { comments, loading: commentsLoading, error: commentsError, submitComment } =
    useComments(id);

  useEffect(() => {
    setIsLoading(true);
    fetchPost(id)
      .then((post) => {
        setPostInfo(post);
        setUiError('');
      })
      .catch((error) => setUiError(error.message))
      .finally(() => setIsLoading(false));
  }, [id, setUiError]);

  if (isLoading) return <p>Loading post...</p>;
  if (!postInfo) return <p>Post unavailable.</p>;

  const authorId = postInfo.author?._id || postInfo.author;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author?.username || 'unknown'}</div>
      {userInfo?.id === authorId && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit this post
          </Link>
        </div>
      )}
      <div className="image">
        <img src={getAssetUrl(postInfo.cover)} alt="" />
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: postInfo.content }} />

      <section className="comments-section">
        <h2>Comments</h2>
        <CommentList comments={comments} loading={commentsLoading} error={commentsError} />
        {userInfo ? <CommentForm onSubmit={submitComment} /> : <p>Login to comment.</p>}
      </section>
    </div>
  );
}
