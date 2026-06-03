import { apiRequest } from '../api';

export function fetchPosts(query = '') {
  const suffix = query ? `?${query}` : '';
  return apiRequest(`/post${suffix}`);
}

export function fetchPost(id) {
  return apiRequest(`/post/${id}?trackView=true`);
}

export function searchPosts(term, page = 1) {
  const params = new URLSearchParams({ q: term, page: String(page), limit: '20' });
  return apiRequest(`/search/posts?${params.toString()}`);
}

export function fetchTags() {
  return apiRequest('/tags');
}

export function fetchCategories() {
  return apiRequest('/categories');
}

export function fetchComments(postId) {
  return apiRequest(`/post/${postId}/comments?withMeta=true&limit=50`);
}

export function createComment(postId, body) {
  return apiRequest(`/post/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body })
  });
}

export function publishPost(postId) {
  return apiRequest(`/post/${postId}/publish`, { method: 'POST' });
}
