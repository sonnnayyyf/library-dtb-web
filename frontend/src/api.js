// frontend/src/api.js
export const BASE = 'http://localhost:3000';

export async function apiGet(path, jwt) {
  const r = await fetch(`${BASE}${path}`, {
    headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function apiPatch(path, body, jwt) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function apiPost(path, body, jwt) {
  const r = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

/* ---- Optional typed helpers (same endpoints page calls) ---- */
const API_BASE = (window.API_BASE || import.meta.env.VITE_API_BASE || 'http://localhost:3000/api');

function looksLikeJWT(v) {
  return typeof v === 'string' && v.split('.').length === 3;
}

function readTokenFallback() {
  // Common keys first
  const candidates = [
    localStorage.getItem('token'),
    localStorage.getItem('jwt'),
    sessionStorage.getItem('token'),
    sessionStorage.getItem('jwt'),
    localStorage.getItem('access_token'),
    sessionStorage.getItem('access_token'),
  ].filter(Boolean);

  // If none of the common keys hit, scan *all* keys
  const scanStores = (store) => {
    try {
      for (let i = 0; i < store.length; i++) {
        const k = store.key(i);
        const v = store.getItem(k);
        if (looksLikeJWT(v)) return v;
      }
    } catch { /* ignore */ }
    return null;
  };

  const first = candidates.find(looksLikeJWT) || scanStores(localStorage) || scanStores(sessionStorage);
  return first || null;
}

function authHeader(jwt) {
  const t = jwt || readTokenFallback();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function startReadingSession(bookId, device = 'web') {
  const res = await fetch(`${API_BASE}/analytics/sessions/start`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ book_id: bookId, device }),
  });
  if (!res.ok) throw new Error(await r.text());
  return res.json();
}

export async function finishReadingSession(sessionId, pages_read = null, highlights = []) {
  const res = await fetch(`${API_BASE}/analytics/sessions/${sessionId}/finish`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ pages_read, highlights }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
