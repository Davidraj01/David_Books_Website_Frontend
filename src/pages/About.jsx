import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, useTitle } from '../api.js';

const SOCIAL = { website: 'Website', amazon: 'Amazon', facebook: 'Facebook', instagram: 'Instagram', youtube: 'YouTube', twitter: 'X / Twitter', linkedin: 'LinkedIn' };

function ContactForm() {
  const [f, setF] = useState({ name: '', email: '', message: '', website: '' });
  const [state, setState] = useState({ busy: false, done: false, err: '' });
  const send = async (e) => {
    e.preventDefault(); setState({ busy: true, done: false, err: '' });
    try { await api.post('/api/contact', f); setState({ busy: false, done: true, err: '' }); setF({ name: '', email: '', message: '', website: '' }); }
    catch (x) { setState({ busy: false, done: false, err: x.message }); }
  };
  if (state.done) return <p className="okmsg">Thank you. Your message has been sent.</p>;
  return (
    <form className="contact" onSubmit={send}>
      <h2>Write to the author</h2>
      <label>Your name<input required maxLength={120} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
      <label>Email<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
      <label>Message<textarea required rows={5} maxLength={4000} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} /></label>
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
      {state.err && <p className="errmsg">{state.err}</p>}
      <button className="buy" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send message'}</button>
    </form>
  );
}

export default function About() {
  const [a, setA] = useState(null);
  const [count, setCount] = useState(null);
  useEffect(() => { api.get('/api/author').then(setA).catch(() => setA({})); api.get('/api/books').then((b) => setCount(b.length)).catch(() => {}); }, []);
  useTitle(a ? a.seo?.metaTitle || `About ${a.name || 'the author'}` : undefined);
  if (!a) return <div className="wrap"><p className="muted">Loading…</p></div>;
  const links = Object.entries(a.socials || {}).filter(([, v]) => v);
  return (
    <div className="wrap about">
      <div className="about-grid">
        {a.photo && <img className="portrait" src={a.photo} alt={a.name} />}
        <div>
          <p className="eyebrow">About the author</p>
          <h1>{a.name}</h1>
          {a.coAuthors && <p className="muted">{a.coAuthors}</p>}
          {a.tagline && <p className="lede">{a.tagline}</p>}
          {a.qualifications?.length > 0 && <p className="chips">{a.qualifications.map((q) => <span key={q}>{q}</span>)}</p>}
          {(a.bio || '').split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
          {a.highlights?.length > 0 && (
            <dl className="highlights">{a.highlights.map((h, i) => <div key={i}><dt>{h.value}</dt><dd>{h.label}</dd></div>)}</dl>
          )}
          {count > 0 && <p><Link className="buy" to="/">See all {count} books →</Link></p>}
          {(links.length > 0 || a.email) && (
            <p className="links">
              {links.map(([k, v]) => <a key={k} href={v} target="_blank" rel="noopener me">{SOCIAL[k]}</a>)}
              {a.email && <a href={`mailto:${a.email}`}>Email</a>}
            </p>
          )}
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
