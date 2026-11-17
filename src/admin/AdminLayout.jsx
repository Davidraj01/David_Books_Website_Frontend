import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api, getToken, setToken } from '../api.js';

export default function AdminLayout() {
  const nav = useNavigate();
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!getToken()) return nav('/admin/login', { replace: true });
    api.get('/api/auth/me').then(() => setOk(true)).catch(() => { setToken(null); nav('/admin/login', { replace: true }); });
  }, [nav]);
  if (!ok) return null;
  return (
    <div className="admin">
      <aside>
        <div className="a-brand">Admin panel</div>
        <NavLink to="/admin/books">Books</NavLink>
        <NavLink to="/admin/author">About Author</NavLink>
        <NavLink to="/admin/messages">Messages</NavLink>
        <NavLink to="/admin/seo">SEO &amp; Site</NavLink>
        <NavLink to="/admin/account">Password</NavLink>
        <a href="/" target="_blank" rel="noopener">View website ↗</a>
        <button className="linkbtn" onClick={() => { setToken(null); nav('/admin/login'); }}>Sign out</button>
      </aside>
      <section className="a-main"><Outlet /></section>
    </div>
  );
}
