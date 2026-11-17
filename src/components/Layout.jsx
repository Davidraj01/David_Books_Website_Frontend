import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { api } from '../api.js';

export default function Layout() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/api/settings').then(setS).catch(() => {}); }, []);
  return (
    <div className="site">
      <header className="topbar wrap">
        <Link to="/" className="brand">{s?.siteName || 'Books'}</Link>
        <nav>
          <NavLink to="/" end>Books</NavLink>
          <NavLink to="/about">About the Author</NavLink>
        </nav>
      </header>
      <main><Outlet context={{ settings: s }} /></main>
      <footer className="wrap foot">
        <span>{s?.footerText || s?.siteName}</span>
        {s?.authorAmazonUrl && <a href={s.authorAmazonUrl} target="_blank" rel="noopener">Amazon author page</a>}
      </footer>
    </div>
  );
}
