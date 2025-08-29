import React, { useEffect, useMemo, useState } from 'react';
import { apiGet, apiPost } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Books() {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  const fetchBooks = async () => {
    setLoading(true);
    try { setRows(await apiGet(`/books${q ? `?q=${encodeURIComponent(q)}` : ''}`, token)); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchBooks(); }, []);

  const borrow = async (id) => {
    try {
      const r = await apiPost('/loans/borrow', { book_id: id }, token);
      await fetchBooks();
      alert(`Borrowed. checkout_id=${r.checkout_id}`);
    } catch (e) { alert(`Borrow failed: ${e.message}`); }
  };

  const list = useMemo(() => rows ?? [], [rows]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Browse Books</h2>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Search title/author/publisher"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
        />
        <button
          onClick={fetchBooks}
          disabled={loading}
          className="rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Loading…' : 'Search'}
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {['Title','Authors','Publisher','Year','Avail','Retired','Avg ★','Actions'].map(h=>(
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {list.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.authors || '-'}</td>
                  <td className="px-4 py-2">{b.publisher || '-'}</td>
                  <td className="px-4 py-2">{b.published_year || '-'}</td>
                  <td className="px-4 py-2">{b.available_copies}</td>
                  <td className="px-4 py-2">{b.is_retired ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{b.avg_rating ?? '-'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => borrow(b.id)}
                      disabled={!user || b.is_retired || b.available_copies <= 0}
                      className="rounded-md bg-brand-600 text-white px-3 py-1.5 hover:bg-brand-700 disabled:opacity-50"
                    >
                      Borrow
                    </button>
                  </td>
                </tr>
              ))}
              {!list.length && (
                <tr><td className="px-4 py-10 text-center text-gray-500" colSpan="8">No results</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
