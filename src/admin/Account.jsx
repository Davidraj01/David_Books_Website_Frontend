import React, { useState } from 'react';
import { api } from '../api.js';
import { useSaved } from './fields.jsx';

export default function Account() {
  const [f, setF] = useState({ currentPassword: '', newPassword: '' });
  const [err, setErr] = useState('');
  const [msg, flash] = useSaved();
  const save = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.post('/api/auth/password', f); setF({ currentPassword: '', newPassword: '' }); flash('Password changed.'); } catch (x) { setErr(x.message); }
  };
  return (
    <form onSubmit={save} className="form narrow">
      <div className="a-head"><h1>Change password</h1></div>
      <fieldset className="card">
        <label>Current password<input type="password" required value={f.currentPassword} onChange={(e) => setF({ ...f, currentPassword: e.target.value })} /></label>
        <label>New password (min 8 characters)<input type="password" required minLength={8} value={f.newPassword} onChange={(e) => setF({ ...f, newPassword: e.target.value })} /></label>
        {err && <p className="err">{err}</p>}
        <div className="bar"><button className="btn">Change password</button>{msg && <span className="ok">{msg}</span>}</div>
      </fieldset>
    </form>
  );
}
