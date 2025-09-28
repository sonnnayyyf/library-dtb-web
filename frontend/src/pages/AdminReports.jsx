// frontend/src/pages/AdminReports.jsx
import React, { useState } from 'react';
import { apiGet } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function AdminReports() {
  const { token } = useAuth();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [limit, setLimit] = useState(10);
  const [threshold, setThreshold] = useState(1);

  // SQL reports you already had
  const [most, setMost] = useState([]);
  const [readers, setReaders] = useState([]);
  const [low, setLow] = useState([]);

  // Mongo reports
  const [avgRows, setAvgRows] = useState([]);
  const [hiRows, setHiRows] = useState([]);
  const [topRows, setTopRows] = useState([]);

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const safeFetch = async (path, setter) => {
    try {
      const data = await apiGet(path, token);
      setter(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr(e?.message || 'Failed to fetch');
      setter([]);
    }
  };

  // ------- SQL (existing) -------
  const runMost = async () => {
    setLoading(true); setErr('');
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    if (limit) qs.set('limit', String(limit));
    await safeFetch(`/reports/most-borrowed?${qs.toString()}`, setMost);
    setLoading(false);
  };

  const runReaders = async () => {
    setLoading(true); setErr('');
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    if (limit) qs.set('limit', String(limit));
    await safeFetch(`/reports/top-readers?${qs.toString()}`, setReaders);
    setLoading(false);
  };

  const runLow = async () => {
    setLoading(true); setErr('');
    const qs = new URLSearchParams();
    qs.set('threshold', String(threshold ?? 0));
    if (limit) qs.set('limit', String(limit));
    await safeFetch(`/reports/low-availability?${qs.toString()}`, setLow);
    setLoading(false);
  };

  // ------- Mongo (new) -------
  const runAnalytics = async () => {
    setLoading(true); setErr('');
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    const q = qs.toString();

    await Promise.all([
      safeFetch(`/api/analytics/reports/avg-session-time${q ? `?${q}` : ''}`, setAvgRows),
      safeFetch(`/api/analytics/reports/most-highlighted${q ? `?${q}` : ''}`, setHiRows),
      safeFetch(`/api/analytics/reports/top-reading-time?limit=10${q ? `&${q}` : ''}`, setTopRows),
    ]);

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Admin: Reports</h2>

      {/* Filters */}
      <div className="bg-white shadow-sm rounded-xl p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-3">
          <label className="block text-xs text-gray-600 mb-1">From</label>
          <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-3">
          <label className="block text-xs text-gray-600 mb-1">To</label>
          <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-600 mb-1">Limit</label>
          <input type="number" min="1" value={limit} onChange={e=>setLimit(Number(e.target.value)||10)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-gray-600 mb-1">Low availability ≤</label>
          <input type="number" min="0" value={threshold} onChange={e=>setThreshold(Number(e.target.value)||0)} className="w-full border rounded-md px-3 py-2" />
        </div>
        <div className="md:col-span-12 flex flex-wrap gap-2">
          <button onClick={runMost} className="rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">Most Borrowed</button>
          <button onClick={runReaders} className="rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">Top Readers</button>
          <button onClick={runLow} className="rounded-md bg-brand-600 text-white px-4 py-2 hover:bg-brand-700">Low Availability</button>
          <span className="mx-2 text-gray-300">|</span>
          <button onClick={runAnalytics} className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">
            Load Reading Analytics
          </button>
          {loading && <span className="text-sm text-gray-600 ml-2">Loading…</span>}
          {err && <span className="text-sm text-red-600 ml-2">{err}</span>}
        </div>
      </div>

      {/* --- SQL tables (unchanged UI) --- */}

      {/* Most Borrowed */}
      <section className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b"><h3 className="font-medium">Most Borrowed Books</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Book</th>
                <th className="px-4 py-2 text-left">Authors</th>
                <th className="px-4 py-2 text-left">Borrowed</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {most.map(r=>(
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{r.authors || '-'}</td>
                  <td className="px-4 py-2">{r.borrow_count}</td>
                </tr>
              ))}
              {!most.length && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Readers */}
      <section className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b"><h3 className="font-medium">Top Active Readers</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Checkouts</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {readers.map(r=>(
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.email}</td>
                  <td className="px-4 py-2">{r.checkout_count}</td>
                </tr>
              ))}
              {!readers.length && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Low availability */}
      <section className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b"><h3 className="font-medium">Books with Low Availability</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Genre</th>
                <th className="px-4 py-2 text-left">Publisher</th>
                <th className="px-4 py-2 text-left">Copies</th>
                <th className="px-4 py-2 text-left">Available</th>
                <th className="px-4 py-2 text-left">Out</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {low.map(b=>(
                <tr key={b.id}>
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.genre || '-'}</td>
                  <td className="px-4 py-2">{b.publisher || '-'}</td>
                  <td className="px-4 py-2">{b.copies}</td>
                  <td className="px-4 py-2">{b.available_copies}</td>
                  <td className="px-4 py-2">{b.out_count}</td>
                </tr>
              ))}
              {!low.length && <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Mongo analytics --- */}

      {/* Average Session Time per User */}
      <section className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b"><h3 className="font-medium">Average Session Time per User</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Sessions</th>
                <th className="px-4 py-2 text-left">Avg (min)</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {avgRows.map(u=>(
                <tr key={u.user_id}>
                  <td className="px-4 py-2">{u.name || '-'}</td>
                  <td className="px-4 py-2">{u.email || '-'}</td>
                  <td className="px-4 py-2">{u.sessions}</td>
                  <td className="px-4 py-2">{u.avg_minutes}</td>
                </tr>
              ))}
              {!avgRows.length && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Most Highlighted Books */}
      <section className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b"><h3 className="font-medium">Most Highlighted Books</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Book</th>
                <th className="px-4 py-2 text-left">Publisher</th>
                <th className="px-4 py-2 text-left">Highlights</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {hiRows.map(b=>(
                <tr key={b.book_id}>
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.publisher || '-'}</td>
                  <td className="px-4 py-2">{b.highlights}</td>
                </tr>
              ))}
              {!hiRows.length && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top reading time */}
      <section className="bg-white shadow-sm rounded-xl overflow-hidden mb-8">
        <div className="px-4 py-3 border-b"><h3 className="font-medium">Top 10 Books by Total Reading Time</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Book</th>
                <th className="px-4 py-2 text-left">Publisher</th>
                <th className="px-4 py-2 text-left">Sessions</th>
                <th className="px-4 py-2 text-left">Total Minutes</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topRows.map(b=>(
                <tr key={b.book_id}>
                  <td className="px-4 py-2">{b.title}</td>
                  <td className="px-4 py-2">{b.publisher || '-'}</td>
                  <td className="px-4 py-2">{b.sessions}</td>
                  <td className="px-4 py-2">{b.total_minutes}</td>
                </tr>
              ))}
              {!topRows.length && <tr><td colSpan="4" className="px-4 py-8 text-center text-gray-500">No data</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
