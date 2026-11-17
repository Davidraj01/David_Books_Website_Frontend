import React, { useEffect, useState } from 'react';
import { api } from '../api.js';
import { ImageField, SeoFields, useSaved } from './fields.jsx';

export default function SeoSettings() {
  const [s, setS] = useState(null);
  const [err, setErr] = useState('');
  const [msg, flash] = useSaved();
  useEffect(() => { api.get('/api/admin/settings').then((x) => setS({ ...x, homeSeo: x.homeSeo || {} })).catch((e) => setErr(e.message)); }, []);
  if (!s) return err ? <p className="err">{err}</p> : <p>Loading…</p>;
  const set = (k, v) => setS({ ...s, [k]: v });
  const save = async (e) => {
    e.preventDefault(); setErr('');
    try { await api.put('/api/admin/settings', s); flash('Saved.'); } catch (x) { setErr(x.message); }
  };
  const T = ({ k, label, ph, type = 'text' }) => <label>{label}<input type={type} value={s[k] || ''} placeholder={ph} onChange={(e) => set(k, e.target.value)} /></label>;
  return (
    <form onSubmit={save} className="form">
      <div className="a-head"><h1>SEO &amp; site settings</h1></div>
      {err && <p className="err">{err}</p>}
      <fieldset className="card">
        <legend>Home page text</legend>
        <T k="siteName" label="Site name" />
        <T k="homeHeading" label="Main heading" />
        <label>Sub heading<textarea rows={2} value={s.homeSubheading} onChange={(e) => set('homeSubheading', e.target.value)} /></label>
        <T k="footerText" label="Footer text" />
        <T k="authorAmazonUrl" label="Amazon author page link (shown in footer)" type="url" ph="https://www.amazon.com/author/…" />
      </fieldset>
      <SeoFields value={s.homeSeo} onChange={(v) => set('homeSeo', v)} fallbackTitle={`${s.siteName} – ${s.homeHeading}`} fallbackDesc={s.homeSubheading} url="/" />
      <fieldset className="card">
        <legend>Sitewide SEO</legend>
        <ImageField label="Default share image" value={s.defaultOgImage} onChange={(v) => set('defaultOgImage', v)} hint="Used on any page that has no image of its own. 1200×630 recommended." />
        <T k="twitterHandle" label="X / Twitter handle" ph="@name" />
        <T k="googleVerification" label="Google Search Console verification code" ph="content value only" />
        <T k="bingVerification" label="Bing Webmaster verification code" />
        <T k="gaId" label="Google Analytics measurement ID" ph="G-XXXXXXXXXX" />
        <label>Extra robots.txt lines (advanced)<textarea rows={3} value={s.robotsExtra} onChange={(e) => set('robotsExtra', e.target.value)} /></label>
        <p className="hint">Sitemap: <code>/sitemap.xml</code> and robots: <code>/robots.txt</code> are generated automatically. Submit the sitemap in Google Search Console.</p>
      </fieldset>
      <div className="bar"><button className="btn">Save</button>{msg && <span className="ok">{msg}</span>}</div>
    </form>
  );
}
