'use client';
import { useEffect, useState } from 'react';

// Wallpaper, CRT effect and screensaver picker. Choices live in localStorage; the wallpaper is a
// data-wall attribute on <html> (applied before paint by the inline script in app/layout.js).
const WALLS = [
  { id: 'checker', label: 'Checker' },
  { id: 'plain', label: 'Plain' },
  { id: 'dots', label: 'Dots' },
  { id: 'grid', label: 'Blueprint' },
  { id: 'rain', label: 'Code rain' },
];
const SAVERS = [
  { id: 'keys', label: 'Ctrl + Z keycaps' },
  { id: 'badge', label: 'Bouncing badge' },
];
const get = (k, d) => { try { return localStorage.getItem(k) || d; } catch { return d; } };
const set = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

export default function Display({ onSaver }) {
  const [wall, setWall] = useState('checker');
  const [saver, setSaver] = useState('keys');
  const [crt, setCrt] = useState(true);
  useEffect(() => { setWall(get('ctrlz-wall', 'checker')); setSaver(get('ctrlz-saver', 'keys')); setCrt(get('ctrlz-crt', 'on') !== 'off'); }, []);

  const pickWall = (id) => { setWall(id); set('ctrlz-wall', id); document.documentElement.dataset.wall = id; };
  const pickSaver = (id) => { setSaver(id); set('ctrlz-saver', id); };
  const toggleCrt = (on) => {
    setCrt(on); set('ctrlz-crt', on ? 'on' : 'off');
    if (on) delete document.documentElement.dataset.crt; else document.documentElement.dataset.crt = 'off';
  };

  return (
    <div className="display">
      <fieldset>
        <legend>Wallpaper</legend>
        <div className="walls">
          {WALLS.map((w) => (
            <label key={w.id} className="wall-pick">
              <input type="radio" name="wall" checked={wall === w.id} onChange={() => pickWall(w.id)} />
              <span className="swatch sunken" data-wall={w.id} aria-hidden="true" />
              <span>{w.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Screen</legend>
        <label className="saver-pick">
          <input type="checkbox" checked={crt} onChange={(e) => toggleCrt(e.target.checked)} />
          <span>CRT effect (scanlines and a curved-glass shadow)</span>
        </label>
      </fieldset>
      <fieldset>
        <legend>Screensaver</legend>
        {SAVERS.map((s) => (
          <label key={s.id} className="saver-pick">
            <input type="radio" name="saver" checked={saver === s.id} onChange={() => pickSaver(s.id)} />
            <span>{s.label}</span>
          </label>
        ))}
        <p className="display-note">Starts after 45 seconds without input.</p>
        <button type="button" className="btn" onClick={onSaver}>Preview</button>
      </fieldset>
    </div>
  );
}
