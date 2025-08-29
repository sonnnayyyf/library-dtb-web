import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function MyLoans() {
  const { token } = useAuth();
  const [rows,setRows]=useState([]);
  const [review,setReview]=useState({}); // checkout_id -> {rating, comment}

  const load=async()=>setRows(await apiGet('/loans/my', token));
  useEffect(()=>{ load(); },[]);

  const returnBook=async(checkout_id)=>{
    await apiPost('/loans/return', { checkout_id }, token);
    await load();
  };

  const submitReview=async(book_id, checkout_id)=>{
    const data = review[checkout_id] || {};
    if (!data.rating) { alert('Pick a rating'); return; }
    await apiPost('/reviews', { book_id, rating:Number(data.rating), comment:data.comment||null }, token);
    setReview(prev=>({ ...prev, [checkout_id]: undefined }));
    alert('Thanks for the review!');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">My Loans</h2>
      <div className="bg-white shadow-sm rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                {['Title','Checkout','Due','Return','Status','Actions'].map(h=>(
                  <th key={h} className="px-4 py-2 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map(r=>(
                <tr key={r.checkout_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{r.title}</td>
                  <td className="px-4 py-2">{new Date(r.checkout_date).toLocaleString()}</td>
                  <td className="px-4 py-2">{new Date(r.due_date).toLocaleString()}</td>
                  <td className="px-4 py-2">{r.return_date? new Date(r.return_date).toLocaleString() : '-'}</td>
                  <td className="px-4 py-2">{r.status}{r.late?' (late)':''}</td>
                  <td className="px-4 py-2 space-y-2">
                    {!r.return_date && (
                      <button onClick={()=>returnBook(r.checkout_id)}
                              className="rounded-md bg-brand-600 text-white px-3 py-1.5 hover:bg-brand-700">
                        Return
                      </button>
                    )}
                    {r.return_date && (
                      <div className="flex flex-wrap items-center gap-2">
                        <select className="border rounded px-2 py-1"
                                value={review[r.checkout_id]?.rating || ''}
                                onChange={e=>setReview(p=>({ ...p, [r.checkout_id]: { ...(p[r.checkout_id]||{}), rating:e.target.value } }))}>
                          <option value="">Rate ★</option>
                          {[1,2,3,4,5].map(n=><option key={n} value={n}>{n}</option>)}
                        </select>
                        <input className="border rounded px-2 py-1"
                               placeholder="Comment (optional)"
                               value={review[r.checkout_id]?.comment || ''}
                               onChange={e=>setReview(p=>({ ...p, [r.checkout_id]: { ...(p[r.checkout_id]||{}), comment:e.target.value } }))} />
                        <button onClick={()=>submitReview(r.book_id, r.checkout_id)}
                                className="rounded bg-gray-900 text-white px-3 py-1.5 hover:bg-gray-800">
                          Submit
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!rows.length && <tr><td className="px-4 py-10 text-center text-gray-500" colSpan="6">No loans</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
