import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { ImageField, SeoFields } from './fields.jsx';

const EMPTY = { title: '', subtitle: '', slug: '', language: 'en', description: '', cover: '', amazonUrl: '', isbn: '', published: true, seo: {} };

export default function BookForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [b, setB] = useState(id ? null : EMPTY);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (id) api.get(`/api/admin/books/${id}`).then((x) => setB({ ...EMPTY, ...x, seo: x.seo || {} })).catch((e) => setErr(e.message)); }, [id]);
  if (!b) return err ? <p className="err">{err}</p> : <p>Loading…</p>;
  const set = (k, v) => setB({ ...b, [k]: v });

  const save = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      if (id) await api.put(`/api/admin/books/${id}`, b); else await api.post('/api/admin/books', b);
      nav('/admin/books');
    } catch (x) { setErr(x.message); window.scrollTo(0, 0); } finally { setBusy(false); }
  };
  const slugPreview = b.slug || '(made from the title)';
  return (
    <form onSubmit={save} className="form">
      <div className="a-head"><h1>{id ? 'Edit book' : 'Add new book'}</h1></div>
      {err && <p className="err">{err}</p>}
      <fieldset className="card">
        <legend>Book details</legend>
        <label>Title *<input required value={b.title} onChange={(e) => set('title', e.target.value)} /></label>
        <label>Subtitle<input value={b.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></label>
        <div className="two">
          <label>Language
            <select value={['en', 'ta'].includes(b.language) ? b.language : 'other'} onChange={(e) => set('language', e.target.value === 'other' ? '' : e.target.value)}>
              <option value="en">English</option><option value="ta">தமிழ் (Tamil)</option><option value="other">Other…</option>
            </select>
            {!['en', 'ta'].includes(b.language) && <input placeholder="language code, e.g. hi" value={b.language} onChange={(e) => set('language', e.target.value)} />}
          </label>
          <label>ISBN (optional)<input value={b.isbn} onChange={(e) => set('isbn', e.target.value)} /></label>
        </div>
        <label>Amazon link for this book *<input required type="url" placeholder="https://www.amazon.in/dp/XXXXXXXXXX" value={b.amazonUrl} onChange={(e) => set('amazonUrl', e.target.value)} /></label>
        {/\/author\//.test(b.amazonUrl) && <p className="warn">This looks like an author page link. Use the link of this book's own page.</p>}
        <p className="hint">Paste the link of this book's own Amazon page (not the author page). Short amzn.in links work too.</p>
        <ImageField label="Front cover" value={b.cover} onChange={(v) => set('cover', v)} hint="JPG, PNG or WebP, up to 6 MB. Portrait 2:3 looks best." />
        <label>About this book (shown on the book page; blank line = new paragraph)<textarea rows={8} value={b.description} onChange={(e) => set('description', e.target.value)} /></label>
        <label className="check"><input type="checkbox" checked={b.published} onChange={(e) => set('published', e.target.checked)} /> Show on the website</label>
      </fieldset>
      <fieldset className="card">
        <legend>Web address</legend>
        <label>URL slug<input value={b.slug} onChange={(e) => set('slug', e.target.value)} placeholder="auto from title" /></label>
        <p className="hint">Page address: /books/{slugPreview}. Tamil titles need an English slug typed here for a clean link.</p>
      </fieldset>
      <SeoFields value={b.seo} onChange={(v) => set('seo', v)} fallbackTitle={`${b.title}${b.subtitle ? ' – ' + b.subtitle : ''}`} fallbackDesc={(b.description || b.subtitle || '').slice(0, 160)} url={`/books/${b.slug || '…'}`} />
      <div className="bar"><button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Save book'}</button><button type="button" className="btn ghost" onClick={() => nav('/admin/books')}>Cancel</button></div>
    </form>
  );
}
