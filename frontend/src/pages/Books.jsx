import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export default function Books() {
  const { token, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');

  const fetchBooks = async () => {
    const data = await apiGet(`/books${q ? `?q=${encodeURIComponent(q)}` : ''}`, token);
    setRows(data || []);
  };

  useEffect(() => { fetchBooks(); }, []); // initial load

  const borrow = async (bookId) => {
    try {
      await apiPost('/loans/borrow', { book_id: bookId }, token);
      fetchBooks();
    } catch (e) {
      alert(e.message || 'Borrow failed');
    }
  };

  // ---- Reading sessions (Mongo) ----
  const sessionKey = (bookId) => `readingSession:${user?.id || 'anon'}:${bookId}`;

  const startReading = async (bookId) => {
    try {
      const res = await fetch(`${API_BASE}/analytics/sessions/start`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({ book_id: bookId, device: 'web' }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { session_id } = await res.json();
      localStorage.setItem(sessionKey(bookId), String(session_id));
      alert('Reading session started.');
    } catch (err) {
      console.error(err);
      alert('Failed to start session');
    }
  };

  const finishReading = async (bookId) => {
    try {
      const sid = localStorage.getItem(sessionKey(bookId));
      if (!sid) return alert('No active session for this book.');
      const pages = window.prompt('Pages read this session?', '10');
      const pages_read = pages ? Number(pages) : null;
      const res = await fetch(`${API_BASE}/analytics/sessions/${sid}/finish`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({ pages_read, highlights: [] }),
      });
      if (!res.ok) throw new Error(await res.text());
      localStorage.removeItem(sessionKey(bookId));
      alert('Session finished.');
    } catch (err) {
      console.error(err);
      alert('Failed to finish session');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Browse Books</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search title / author / genre / publisher"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
        />
        <button
          onClick={fetchBooks}
          className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {['Title', 'Authors', 'Genre', 'Publisher', 'Avail', 'Retired', 'Avg ★', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-2 text-left">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((b) => {
                const activeSession = user && !!localStorage.getItem(sessionKey(b.id));
                return (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{b.title}</td>
                    <td className="px-4 py-2">{b.authors || '-'}</td>
                    <td className="px-4 py-2">{b.genre || '-'}</td>
                    <td className="px-4 py-2">{b.publisher || '-'}</td>
                    <td className="px-4 py-2">{b.available_copies}</td>
                    <td className="px-4 py-2">{b.is_retired ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">{b.avg_rating ?? '-'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        disabled={!token || b.available_copies <= 0 || b.is_retired}
                        onClick={() => borrow(b.id)}
                        className="rounded-md bg-indigo-600 text-white px-3 py-1.5 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        Borrow
                      </button>

                      {user && user.role === 'reader' && (
                        activeSession ? (
                          <button
                            onClick={() => finishReading(b.id)}
                            className="rounded-md bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700"
                          >
                            Finish
                          </button>
                        ) : (
                          <button
                            onClick={() => startReading(b.id)}
                            className="rounded-md bg-slate-600 text-white px-3 py-1.5 hover:bg-slate-700"
                          >
                            Start
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-gray-500">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
