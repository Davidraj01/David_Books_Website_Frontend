import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api, useTitle } from '../api.js';
import BookCard from '../components/BookCard.jsx';

const LANGS = { en: 'English', ta: 'தமிழ்' };

export default function Home() {
  const { settings } = useOutletContext();
  const [books, setBooks] = useState(null);
  const [lang, setLang] = useState('all');
  const [q, setQ] = useState('');
  useEffect(() => { api.get('/api/books').then(setBooks).catch(() => setBooks([])); }, []);
  useTitle(settings ? settings.homeSeo?.metaTitle || `${settings.siteName} – ${settings.homeHeading}` : undefined);

  const langs = books ? [...new Set(books.map((b) => b.language))] : [];
  const needle = q.trim().toLowerCase();
  const shown = books
    ? books.filter((b) => (lang === 'all' || b.language === lang) && (!needle || `${b.title} ${b.subtitle}`.toLowerCase().includes(needle)))
    : [];
  return (
    <div className="wrap">
      <header className="hero">
        <h1>{settings?.homeHeading}</h1>
        <p className="lede">{settings?.homeSubheading}</p>
        <div className="tools">
          {langs.length > 1 && (
            <div className="filters">
              <button className={lang === 'all' ? 'on' : ''} onClick={() => setLang('all')}>All <small>{books.length}</small></button>
              {langs.map((l) => (
                <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>
                  {LANGS[l] || l.toUpperCase()} <small>{books.filter((b) => b.language === l).length}</small>
                </button>
              ))}
            </div>
          )}
          {books && books.length > 8 && (
            <input className="search" type="search" placeholder="Search books…" aria-label="Search books" value={q} onChange={(e) => setQ(e.target.value)} />
          )}
        </div>
      </header>
      {!books ? <p className="muted">Loading…</p> : shown.length ? <div className="grid">{shown.map((b) => <BookCard key={b._id} book={b} />)}</div> : <p className="muted">No books match your search.</p>}
    </div>
  );
}
