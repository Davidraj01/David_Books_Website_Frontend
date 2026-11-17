import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, asset, useTitle } from '../api.js';

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

function Portrait({ photo, name }) {
  const [bad, setBad] = useState(false);
  const initials = (name || 'A').replace(/\b(Dr|Mr|Mrs|Ms)\.?\s/gi, '').split(/\s+/).map((w) => w[0]).filter(Boolean).slice(0, 2).join('');
  return (
    <figure className="portrait-frame">
      {photo && !bad
        ? <img className="portrait" src={asset(photo)} alt={name} onError={() => setBad(true)} />
        : <div className="portrait mono" aria-hidden="true">{initials}</div>}
      <figcaption>{name}</figcaption>
    </figure>
  );
}

export default function About() {
  const [a, setA] = useState(null);
  const [count, setCount] = useState(null);
  useEffect(() => { api.get('/api/author').then(setA).catch(() => setA({})); api.get('/api/books').then((b) => setCount(b.length)).catch(() => {}); }, []);
  useTitle(a ? a.seo?.metaTitle || `About ${a.name || 'the author'}` : undefined);
  if (!a) return <div className="wrap"><p className="muted">Loading…</p></div>;
  const links = Object.entries(a.socials || {}).filter(([, v]) => v);
  const paras = (a.bio || '').split(/\n\s*\n/).filter(Boolean);
  return (
    <div className="wrap about">
      <section className="about-hero">
        <Portrait photo={a.photo} name={a.name} />
        <div className="about-text">
          <p className="eyebrow">About the author</p>
          <h1>{a.name}</h1>
          {a.tagline && <p className="about-tagline">{a.tagline}</p>}
          {a.coAuthors && <p className="about-role">{a.coAuthors}</p>}
          {a.qualifications?.length > 0 && <p className="chips">{a.qualifications.map((q) => <span key={q}>{q}</span>)}</p>}
          <div className="about-bio">
            {paras.map((p, i) => <p key={i} className={i === 0 ? 'first' : undefined}>{p}</p>)}
          </div>
          <div className="about-actions">
            {count > 0 && <Link className="buy big" to="/">Browse all {count} books →</Link>}
            {(links.length > 0 || a.email) && (
              <p className="links">
                {links.map(([k, v]) => <a key={k} href={v} target="_blank" rel="noopener me">{SOCIAL[k]}</a>)}
                {a.email && <a href={`mailto:${a.email}`}>Email</a>}
              </p>
            )}
          </div>
        </div>
      </section>
      {a.highlights?.length > 0 && (
        <dl className="highlights">{a.highlights.map((h, i) => <div key={i}><dt>{h.value}</dt><dd>{h.label}</dd></div>)}</dl>
      )}
      <ContactForm />
    </div>
  );
}
