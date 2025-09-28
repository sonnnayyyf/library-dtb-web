import React, { useEffect, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function AdminBooks() {
  const { token } = useAuth();

  const [rows, setRows] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const [form, setForm] = useState({
    title: '',
    genre: '',
    publisher: '',
    copies: 1,
    authors: '', // comma-separated
  });

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const data = await apiGet(`/books${q ? `?q=${encodeURIComponent(q)}` : ''}`, token);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const add = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const payload = {
        title: form.title,
        genre: form.genre || null,
        publisher: form.publisher || null,
        copies: Number(form.copies || 0),
        authors: form.authors || '',
      };
      await apiPost('/books', payload, token);
      setMsg('✅ Book added');
      setForm({ title: '', genre: '', publisher: '', copies: 1, authors: '' });
      fetchBooks();
    } catch (err) {
      setMsg(`❌ ${err.message || 'Failed to add book'}`);
    }
  };

  const adjust = async (id, delta) => {
    try {
      await apiPatch(
        `/books/${id}/inventory`,
        { delta, reason: delta > 0 ? 'restock' : 'shrinkage' },
        token
      );
      fetchBooks();
    } catch (e) {
      alert(e.message || 'Inventory update failed');
    }
  };

  const retire = async (id) => {
    try {
      await apiPost(`/books/${id}/retire`, { reason: 'obsolete' }, token);
      fetchBooks();
    } catch (e) {
      alert(e.message || 'Retire failed');
    }
  };

  const unretire = async (id) => {
    try {
      await apiPost(`/books/${id}/unretire`, { reason: 'reactivated' }, token);
      fetchBooks();
    } catch (e) {
      alert(e.message || 'Unretire failed');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Admin: Manage Books</h2>

      {/* Create */}
      <form
        onSubmit={add}
        className="bg-white shadow-sm rounded-xl p-5 grid grid-cols-1 md:grid-cols-4 gap-3"
      >
        <input
          name="title"
          required
          value={form.title}
          onChange={onChange}
          placeholder="Title *"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 md:col-span-2"
        />
        <input
          name="genre"
          value={form.genre}
          onChange={onChange}
          placeholder="Genre"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          name="publisher"
          value={form.publisher}
          onChange={onChange}
          placeholder="Publisher"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          name="copies"
          type="number"
          min="0"
          value={form.copies}
          onChange={onChange}
          placeholder="Copies"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <input
          name="authors"
          value={form.authors}
          onChange={onChange}
          placeholder="Authors (comma-separated)"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 md:col-span-2"
        />
        <div className="md:col-span-4 flex items-center gap-3">
          <button className="rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">
            Add Book
          </button>
          {msg && <div className="text-sm text-gray-600">{msg}</div>}
        </div>
      </form>

      {/* Search */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Search title / author / genre / publisher"
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

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {['Title', 'Authors', 'Genre', 'Publisher', 'Copies', 'Avail', 'Retired', 'Avg ★', 'Actions'].map(
                  (h) => (
                    <th key={h} className="px-4 py-2 text-left">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.authors || '-'}</td>
                  <td className="px-4 py-2">{b.genre || '-'}</td>
                  <td className="px-4 py-2">{b.publisher || '-'}</td>
                  <td className="px-4 py-2">{b.copies}</td>
                  <td className="px-4 py-2">{b.available_copies}</td>
                  <td className="px-4 py-2">{b.is_retired ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">{b.avg_rating ?? '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => adjust(b.id, +1)}
                        className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200"
                      >
                        +1
                      </button>
                      <button
                        onClick={() => adjust(b.id, -1)}
                        className="rounded-md bg-gray-100 px-3 py-1.5 hover:bg-gray-200"
                      >
                        -1
                      </button>

                      {!b.is_retired ? (
                        <button
                          onClick={() => retire(b.id)}
                          className="rounded-md bg-red-500 text-white px-3 py-1.5 hover:bg-red-600"
                        >
                          Retire
                        </button>
                      ) : (
                        <button
                          onClick={() => unretire(b.id)}
                          className="rounded-md bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700"
                        >
                          Unretire
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td className="px-4 py-10 text-center text-gray-500" colSpan="9">
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
