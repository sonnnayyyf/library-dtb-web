import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
createRoot(document.getElementById('root')).render(<AuthProvider><BrowserRouter><App/></BrowserRouter></AuthProvider>);
