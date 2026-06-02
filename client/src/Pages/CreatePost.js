import 'react-quill/dist/quill.snow.css';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Editor from '../Editor';
import { apiRequest } from '../api';
import { UserContext } from '../UserContext';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUiError } = useContext(UserContext);

  async function createNewPost(ev) {
    ev.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);
    try {
      await apiRequest('/post', {
        method: 'POST',
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
    return <Navigate to={'/'} />;
  }
  return (
    <form onSubmit={createNewPost}>
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
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: '5px' }} disabled={isSubmitting}>
        {isSubmitting ? 'Creating post...' : 'Create post'}
      </button>
    </form>
  );
}
