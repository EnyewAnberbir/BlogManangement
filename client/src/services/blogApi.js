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

export function fetchAdminDashboard() {
  return apiRequest('/analytics/dashboard');
}

export function fetchAuthorInsights() {
  return apiRequest('/analytics/me');
}

export function fetchNotifications(query = 'withMeta=true&limit=30') {
  return apiRequest(`/notifications?${query}`);
}

export function markNotificationRead(id) {
  return apiRequest(`/notifications/${id}/read`, { method: 'POST' });
}

export function markAllNotificationsRead() {
  return apiRequest('/notifications/read-all', { method: 'POST' });
}

export function fetchMediaLibrary(query = 'withMeta=true&page=1&limit=40') {
  return apiRequest(`/media?${query}`);
}

export function uploadMediaAsset(formData) {
  return apiRequest('/media', { method: 'POST', body: formData });
}

export function deleteMediaAsset(id) {
  return apiRequest(`/media/${id}`, { method: 'DELETE' });
}

export function subscribeNewsletter(email) {
  return apiRequest('/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
}

export function fetchNewsletterStats() {
  return apiRequest('/newsletter/stats');
}

export function runWeeklyDigest() {
  return apiRequest('/jobs/weekly-digest', { method: 'POST' });
}

export function fetchPostRevisions(postId) {
  return apiRequest(`/post/${postId}/revisions`);
}

export function restorePostRevision(postId, revisionNumber) {
  return apiRequest(`/post/${postId}/revisions/${revisionNumber}/restore`, {
    method: 'POST'
  });
}

export function updateProfile(payload) {
  return apiRequest('/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function followAuthor(authorId) {
  return apiRequest(`/authors/${authorId}/follow`, { method: 'POST' });
}

export function unfollowAuthor(authorId) {
  return apiRequest(`/authors/${authorId}/follow`, { method: 'DELETE' });
}

export function fetchFollowing() {
  return apiRequest('/following');
}
