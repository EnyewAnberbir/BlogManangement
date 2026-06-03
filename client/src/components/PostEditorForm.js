import { useEffect, useState } from 'react';
import Editor from '../Editor';
import { fetchCategories, fetchTags } from '../services/blogApi';

export default function PostEditorForm({
  initial = {},
  submitLabel,
  isSubmitting,
  onSubmit
}) {
  const [title, setTitle] = useState(initial.title || '');
  const [summary, setSummary] = useState(initial.summary || '');
  const [content, setContent] = useState(initial.content || '');
  const [status, setStatus] = useState(initial.status || 'draft');
  const [tags, setTags] = useState(initial.tags || '');
  const [categoryId, setCategoryId] = useState(initial.categoryId || '');
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchTags()])
      .then(([categoryRows, tagRows]) => {
        setCategories(categoryRows);
        setAvailableTags(tagRows);
      })
      .catch(() => {
        setCategories([]);
        setAvailableTags([]);
      });
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.set('title', title);
    formData.set('summary', summary);
    formData.set('content', content);
    formData.set('status', status);
    formData.set('tags', tags);
    if (categoryId) formData.set('categoryId', categoryId);
    if (file) formData.set('file', file);
    if (initial.id) formData.set('id', initial.id);
    onSubmit(formData);
  }

  return (
    <form className="post-editor-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} required />
      </label>
      <label>
        Summary
        <input value={summary} onChange={(event) => setSummary(event.target.value)} required />
      </label>
      <label>
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </label>
      <label>
        Category
        <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">None</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tags (comma separated)
        <input
          value={tags}
          onChange={(event) => setTags(event.target.value)}
          placeholder={availableTags.map((tag) => tag.name).slice(0, 3).join(', ')}
        />
      </label>
      <label>
        Cover image
        <input type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
      </label>
      <Editor value={content} onChange={setContent} />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
