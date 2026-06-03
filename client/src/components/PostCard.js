import { Link } from 'react-router-dom';
import { getAssetUrl } from '../api';
import TagPill from './TagPill';

export default function PostCard({ post }) {
  return (
    <article className="post-card">
      {post.cover ? <img src={getAssetUrl(post.cover)} alt={post.title} /> : null}
      <h2>
        <Link to={`/post/${post._id}`}>{post.title}</Link>
      </h2>
      <p>{post.summary}</p>
      <div className="post-card-meta">
        <span>{post.author?.username || 'unknown'}</span>
        {post.viewCount !== undefined ? <span>{post.viewCount} views</span> : null}
      </div>
      {Array.isArray(post.tags) ? (
        <div className="tag-row">
          {post.tags.map((tag) => (
            <TagPill key={tag._id || tag.slug} label={tag.name || tag} slug={tag.slug} />
          ))}
        </div>
      ) : null}
    </article>
  );
}
