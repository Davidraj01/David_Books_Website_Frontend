import React, { useState } from 'react';
import { api, asset } from '../api.js';

export function ImageField({ label, value, onChange, hint }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const pick = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setBusy(true); setErr('');
    try { const r = await api.upload(file); onChange(r.url); } catch (x) { setErr(x.message); } finally { setBusy(false); e.target.value = ''; }
  };
  return (
    <div className="field">
      <span className="lbl">{label}</span>
      <div className="imgfield">
        {value ? <img src={asset(value)} alt="" /> : <div className="ph">No image</div>}
        <div>
          <label className="btn ghost">{busy ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}<input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={pick} /></label>
          {value && <button type="button" className="linkbtn" onClick={() => onChange('')}>Remove</button>}
          {hint && <p className="hint">{hint}</p>}
          {err && <p className="err">{err}</p>}
        </div>
      </div>
    </div>
  );
}

const Counter = ({ n, max, good }) => <small className={n > max ? 'bad' : n >= good ? 'good' : ''}>{n}/{max}</small>;

// Title / description / keywords / share-image fields plus a live Google-style preview.
export function SeoFields({ value = {}, onChange, fallbackTitle, fallbackDesc, url }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const t = value.metaTitle || fallbackTitle || '';
  const d = value.metaDescription || fallbackDesc || '';
  return (
    <fieldset className="card">
      <legend>SEO</legend>
      <div className="serp">
        <span className="serp-url">{url}</span>
        <span className="serp-title">{t.slice(0, 60) || 'Page title'}</span>
        <span className="serp-desc">{d.slice(0, 160) || 'Description shown in search results.'}</span>
      </div>
      <label>Meta title <Counter n={(value.metaTitle || '').length} max={60} good={30} />
        <input value={value.metaTitle || ''} maxLength={120} onChange={(e) => set('metaTitle', e.target.value)} placeholder={fallbackTitle} /></label>
      <label>Meta description <Counter n={(value.metaDescription || '').length} max={160} good={110} />
        <textarea rows={3} maxLength={320} value={value.metaDescription || ''} onChange={(e) => set('metaDescription', e.target.value)} placeholder={fallbackDesc} /></label>
      <label>Keywords (comma separated)<input value={value.keywords || ''} onChange={(e) => set('keywords', e.target.value)} /></label>
      <ImageField label="Share image (WhatsApp / Facebook preview)" value={value.ogImage} onChange={(v) => set('ogImage', v)} hint="Best size 1200×630. Leave empty to use the book cover or the site default." />
      <label className="check"><input type="checkbox" checked={!!value.noindex} onChange={(e) => set('noindex', e.target.checked)} /> Hide this page from search engines (noindex)</label>
    </fieldset>
  );
}

export function useSaved() {
  const [msg, setMsg] = useState('');
  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };
  return [msg, flash];
}
