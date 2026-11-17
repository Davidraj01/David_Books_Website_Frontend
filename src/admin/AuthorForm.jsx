import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { ImageField, SeoFields, useSaved } from './fields.jsx';

const SOCIALS = ['website', 'amazon', 'facebook', 'instagram', 'youtube', 'twitter', 'linkedin'];

export default function AuthorForm() {
  const [a, setA] = useState(null);
  const [err, setErr] = useState('');
  const [msg, flash] = useSaved();
  useEffect(() => { api.get('/api/admin/author').then((x) => setA({ ...x, seo: x.seo || {}, socials: x.socials || {}, qualifications: x.qualifications || [], highlights: x.highlights || [] })).catch((e) => setErr(e.message)); }, []);
  if (!a) return err ? <p className="err">{err}</p> : <p>Loading…</p>;
  const set = (k, v) => setA({ ...a, [k]: v });
  const save = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.put('/api/admin/author', a); flash('Saved. The About page is updated.'); } catch (x) { setErr(x.message); }
  };
  const setHl = (i, k, v) => set('highlights', a.highlights.map((h, j) => (j === i ? { ...h, [k]: v } : h)));
  return (
    <form onSubmit={save} className="form">
      <div className="a-head"><h1>About the author</h1></div>
      {err && <p className="err">{err}</p>}
      <fieldset className="card">
        <legend>Profile</legend>
        <label>Author name<input value={a.name} onChange={(e) => set('name', e.target.value)} /></label>
        <label>Co-author line (optional)<input value={a.coAuthors} onChange={(e) => set('coAuthors', e.target.value)} placeholder="with Bright Livingstone Davidraj" /></label>
        <label>Tagline<input value={a.tagline} onChange={(e) => set('tagline', e.target.value)} placeholder="Entrepreneur & Environmentalist" /></label>
        <ImageField label="Author photo" value={a.photo} onChange={(v) => set('photo', v)} />
        <label>Biography (blank line = new paragraph)<textarea rows={12} value={a.bio} onChange={(e) => set('bio', e.target.value)} /></label>
        <label>Qualifications (one per line)<textarea rows={3} value={a.qualifications.join('\n')} onChange={(e) => set('qualifications', e.target.value.split('\n'))} /></label>
      </fieldset>
      <fieldset className="card">
        <legend>Highlights (e.g. "26 | Books published")</legend>
        {a.highlights.map((h, i) => (
          <div className="two hl" key={i}>
            <input placeholder="Value, e.g. 26" value={h.value || ''} onChange={(e) => setHl(i, 'value', e.target.value)} />
            <input placeholder="Label, e.g. Books published" value={h.label || ''} onChange={(e) => setHl(i, 'label', e.target.value)} />
            <button type="button" className="danger" onClick={() => set('highlights', a.highlights.filter((_, j) => j !== i))}>Remove</button>
          </div>
        ))}
        <button type="button" className="btn ghost" onClick={() => set('highlights', [...a.highlights, { value: '', label: '' }])}>+ Add highlight</button>
      </fieldset>
      <fieldset className="card">
        <legend>Contact and links</legend>
        <label>Email<input type="email" value={a.email} onChange={(e) => set('email', e.target.value)} /></label>
        {SOCIALS.map((k) => (
          <label key={k} className="cap">{k}<input type="url" placeholder="https://" value={a.socials[k] || ''} onChange={(e) => set('socials', { ...a.socials, [k]: e.target.value })} /></label>
        ))}
      </fieldset>
      <SeoFields value={a.seo} onChange={(v) => set('seo', v)} fallbackTitle={`About ${a.name}`} fallbackDesc={(a.bio || '').slice(0, 160)} url="/about" />
      <div className="bar"><button className="btn">Save</button>{msg && <span className="ok">{msg}</span>}</div>
    </form>
  );
}
