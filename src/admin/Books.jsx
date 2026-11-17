import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken } from '../api.js';

export default function Books() {
  const [books, setBooks] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/api/admin/books').then(setBooks).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);

  const move = async (i, d) => {
    const next = [...books]; const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setBooks(next);
    await api.put('/api/admin/books-order', { ids: next.map((b) => b._id) });
  };
  const toggle = async (b) => { await api.put(`/api/admin/books/${b._id}`, { published: !b.published }); load(); };
  const remove = async (b) => {
    if (!window.confirm(`Delete "${b.title}"? This cannot be undone.`)) return;
    await api.del(`/api/admin/books/${b._id}`); load();
  };
  const backup = async () => {
    const r = await fetch('/api/admin/export', { headers: { Authorization: `Bearer ${getToken()}` } });
    const url = URL.createObjectURL(await r.blob());
    const a = document.createElement('a'); a.href = url; a.download = `site-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); URL.revokeObjectURL(url);
  };
  if (err) return <p className="err">{err}</p>;
  if (!books) return <p>Loading…</p>;
  return (
    <>
      <div className="a-head"><h1>Books <small>{books.length}</small></h1><span><button className="btn ghost" onClick={backup}>Download backup</button> <Link className="btn" to="/admin/books/new">+ Add new book</Link></span></div>
      <p className="hint">The order here is the order on the website. Use the arrows to move a book.</p>
      <table className="tbl">
        <thead><tr><th></th><th>Title</th><th>Lang</th><th title="Taps on Buy on Amazon">Buy clicks</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {books.map((b, i) => (
            <tr key={b._id}>
              <td className="thumb">{b.cover && <img src={b.cover} alt="" />}</td>
              <td><Link to={`/admin/books/${b._id}`}><strong>{b.title}</strong></Link><br /><span className="muted">/books/{b.slug}</span></td>
              <td>{b.language}</td>
              <td className="num">{b.clicks || 0}</td>
              <td><button className={`pill ${b.published ? 'on' : ''}`} onClick={() => toggle(b)}>{b.published ? 'Published' : 'Hidden'}</button></td>
              <td className="act">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button onClick={() => move(i, 1)} disabled={i === books.length - 1} aria-label="Move down">↓</button>
                <Link to={`/admin/books/${b._id}`}>Edit</Link>
                <button className="danger" onClick={() => remove(b)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
