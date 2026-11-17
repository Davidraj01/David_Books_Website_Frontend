import React, { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Messages() {
  const [list, setList] = useState(null);
  const [err, setErr] = useState('');
  const load = () => api.get('/api/admin/messages').then(setList).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);
  const toggle = async (m) => { await api.put(`/api/admin/messages/${m._id}`, { read: !m.read }); load(); };
  const remove = async (m) => { if (window.confirm('Delete this message?')) { await api.del(`/api/admin/messages/${m._id}`); load(); } };
  if (err) return <p className="err">{err}</p>;
  if (!list) return <p>Loading…</p>;
  return (
    <>
      <div className="a-head"><h1>Messages <small>{list.filter((m) => !m.read).length} new</small></h1></div>
      <p className="hint">Messages sent from the contact form on the About page.</p>
      {list.length === 0 && <p className="muted">No messages yet.</p>}
      {list.map((m) => (
        <article key={m._id} className={`msg ${m.read ? '' : 'new'}`}>
          <header><strong>{m.name} · <a href={`mailto:${m.email}`}>{m.email}</a></strong><span>{new Date(m.createdAt).toLocaleString()}</span></header>
          <p>{m.message}</p>
          <button className="pill" onClick={() => toggle(m)}>{m.read ? 'Mark as new' : 'Mark as read'}</button>{' '}
          <button className="pill danger" onClick={() => remove(m)}>Delete</button>
        </article>
      ))}
    </>
  );
}
