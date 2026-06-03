import 'react-quill/dist/quill.snow.css';
import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { apiRequest } from '../api';
import { UserContext } from '../UserContext';
import PostEditorForm from '../components/PostEditorForm';

export default function CreatePost() {
  const [redirect, setRedirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUiError } = useContext(UserContext);

  async function createNewPost(formData) {
    setIsSubmitting(true);
    try {
      await apiRequest('/post', {
        method: 'POST',
        body: formData
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
    <section>
      <h1>Create post</h1>
      <PostEditorForm
        submitLabel="Create post"
        isSubmitting={isSubmitting}
        onSubmit={createNewPost}
      />
    </section>
  );
}
