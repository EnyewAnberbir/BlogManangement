export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function getAssetUrl(relativePath) {
  return `${API_BASE_URL}/${relativePath}`;
}
