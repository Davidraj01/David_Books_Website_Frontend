import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, asset, trackBuy, useTitle } from '../api.js';
import NotFound from './NotFound.jsx';

function Share({ book }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const text = `${book.title}${book.subtitle ? ' – ' + book.subtitle : ''}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { window.prompt('Copy this link', url); }
  };
  return (
    <div className="share">
      <span className="muted">Share:</span>
      <a href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`} target="_blank" rel="noopener">WhatsApp</a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener">Facebook</a>
      <button onClick={copy}>{copied ? 'Link copied' : 'Copy link'}</button>
    </div>
  );
}

export default function BookPage() {
  const { slug } = useParams();
  const nav = useNavigate();
  const [book, setBook] = useState(undefined);
  const [others, setOthers] = useState([]);
  useEffect(() => {
    setBook(undefined);
    api.get(`/api/books/${slug}`).then((b) => (b.redirectTo ? nav(`/books/${b.redirectTo}`, { replace: true }) : setBook(b))).catch(() => setBook(null));
    window.scrollTo(0, 0);
  }, [slug, nav]);
  useEffect(() => { api.get('/api/books').then(setOthers).catch(() => {}); }, []);
  useTitle(book ? book.seo?.metaTitle || book.title : undefined);
  if (book === null) return <NotFound />;
  if (!book) return <div className="wrap"><p className="muted">Loading…</p></div>;
  // same language first, then the rest, never the current book
  const more = [...others.filter((o) => o._id !== book._id && o.language === book.language), ...others.filter((o) => o._id !== book._id && o.language !== book.language)].slice(0, 4);
  return (
    <div className="wrap bookpage" lang={book.language}>
      <Link to="/" className="back">← All books</Link>
      <div className="bp-grid">
        <div className="bp-cover">{book.cover && <img src={asset(book.cover)} alt={`Front cover of ${book.title}`} />}</div>
        <div>
          <h1>{book.title}</h1>
          {book.subtitle && <p className="lede">{book.subtitle}</p>}
          {book.description && book.description.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}
          {book.isbn && <p className="muted">ISBN: {book.isbn}</p>}
          <a className="buy big" href={book.amazonUrl} target="_blank" rel="noopener" onClick={() => trackBuy(book._id)}>Buy on Amazon →</a>
          <Share book={book} />
        </div>
      </div>
      {more.length > 0 && (
        <section className="more">
          <h2>More books by the author</h2>
          <div className="minigrid">
            {more.map((o) => (
              <Link key={o._id} to={`/books/${o.slug}`} className="mini" lang={o.language}>
                {o.cover && <img src={asset(o.cover)} alt={`Front cover of ${o.title}`} loading="lazy" />}
                <span>{o.title}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
