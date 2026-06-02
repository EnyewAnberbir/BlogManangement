import { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../Editor';
import { apiRequest } from '../api';
import { UserContext } from '../UserContext';

export default function EditPost() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUiError } = useContext(UserContext);

  useEffect(() => {
    apiRequest('/post/' + id)
      .then((postInfo) => {
        setTitle(postInfo.title);
        setContent(postInfo.content);
        setSummary(postInfo.summary);
        setUiError('');
      })
      .catch((error) => setUiError(error.message));
  }, [id, setUiError]);

  async function updatePost(ev) {
    ev.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('id', id);
    if (files?.[0]) {
      data.set('file', files?.[0]);
    }
    try {
      await apiRequest('/post', {
        method: 'PUT',
        body: data
      });
      setUiError('');
      setRedirect(true);
    } catch (error) {
      setUiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (redirect) {
    return <Navigate to={'/post/' + id} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="title"
        placeholder={'Title'}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="summary"
        placeholder={'Summary'}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: '5px' }} disabled={isSubmitting}>
        {isSubmitting ? 'Updating post...' : 'Update post'}
      </button>
    </form>
  );
}
