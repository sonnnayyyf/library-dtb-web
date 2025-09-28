import React from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Books from './pages/Books.jsx';
import AdminBooks from './pages/AdminBooks.jsx';
import MyLoans from './pages/MyLoans.jsx';
import AdminReports from './pages/AdminReports.jsx';

function Navbar() {
  const { user, logout } = useAuth();
  const link = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-brand-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-tight">
            <span className="text-brand-600">Smart</span> Library
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" className={link} end>Home</NavLink>
            <NavLink to="/books" className={link}>Browse</NavLink>
            {user && <NavLink to="/loans" className={link}>My Loans</NavLink>}
            {user?.role !== 'reader' && user && (
              <NavLink to="/admin/books" className={link}>Admin</NavLink>
            )}
            {user?.role !== 'reader' && user && (
              <NavLink to="/admin/reports" className={link}>Reports</NavLink>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login" className="text-sm text-gray-600 hover:text-brand-600">Log in</Link>
                <Link to="/signup" className="inline-flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700">Sign up</Link>
              </>
            ) : (
              <>
                <span className="hidden sm:block text-sm text-gray-600">
                  Hi <b>{user.name}</b> <span className="text-gray-400">({user.role})</span>
                </span>
                <button onClick={logout} className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
                  Log out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role && !(Array.isArray(role) && role.includes(user.role)))
    return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/books" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/loans" element={<RequireAuth><MyLoans /></RequireAuth>} />
          <Route path="/admin/books" element={<RequireAuth role={['staff','admin']}><AdminBooks /></RequireAuth>} />
          <Route path="/admin/reports" element={<RequireAuth role={['staff','admin']}><AdminReports/></RequireAuth>} />
        </Routes>
      </main>
      <footer className="text-center text-xs text-gray-400 py-6">
        Built for the DB/Web assignment — {new Date().getFullYear()}
      </footer>
    </div>
  );
}
