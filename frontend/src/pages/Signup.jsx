import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiPost } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

export default function Signup() {
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [msg,setMsg]=useState(''); const nav=useNavigate();
  const { setToken, setUser } = useAuth();

  const submit=async e=>{
    e.preventDefault(); setMsg('');
    try{
      const { token, user } = await apiPost('/auth/signup', { name, email, password });
      setToken(token); setUser(user);
      nav('/', { replace:true });
    }catch(err){ setMsg(`Signup failed: ${err.message}`); }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                   value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                   value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input type="password"
                   className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                   value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="w-full rounded-md bg-brand-600 text-white px-3 py-2 hover:bg-brand-700">Sign up</button>
          {msg && <div className="text-sm text-red-600">{msg}</div>}
        </form>
        <p className="mt-4 text-sm text-gray-500">Already have an account?
          <Link to="/login" className="text-brand-600 hover:underline ml-1">Log in</Link>
        </p>
      </div>
    </div>
  );
}
