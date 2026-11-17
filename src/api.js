// Backend base URL. Empty in dev (Vite proxies /api and /uploads to localhost:5000).
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
export const asset = (u) => (u && u.startsWith('/') ? API_BASE + u : u);

const TOKEN_KEY = 'author_admin_token';
export const getToken = () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } };
export const setToken = (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } };

async function request(method, url, body, isForm) {
  const headers = {};
  const t = getToken();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  const res = await fetch(API_BASE + url, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && url.startsWith('/api/admin')) { setToken(null); window.location.href = '/admin/login'; }
    throw new Error(data.message || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get: (u) => request('GET', u),
  post: (u, b) => request('POST', u, b),
  put: (u, b) => request('PUT', u, b),
  del: (u) => request('DELETE', u),
  upload: (file) => { const f = new FormData(); f.append('image', file); return request('POST', '/api/admin/upload', f, true); },
};

export const useTitle = (title) => {
  // client-side navigation: keep the tab title right (the server already sends full SEO tags on first load)
  if (typeof document !== 'undefined' && title) document.title = title;
};

// fire-and-forget count of taps on "Buy on Amazon"
export const trackBuy = (id) => {
  try { navigator.sendBeacon(`/api/books/${id}/click`); } catch { /* ignore */ }
};
export const slugLink = (b) => `/books/${b.slug}`;
