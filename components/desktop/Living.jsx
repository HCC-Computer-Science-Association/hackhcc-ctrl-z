'use client';
import { useEffect, useRef, useState } from 'react';
import { stickyNote, watermark } from '../../content';

// Drifting pixel clouds. Pure CSS motion; the elements are decorative.
export function Clouds() {
  return (
    <div className="clouds" aria-hidden="true">
      <span className="cloud cloud-a" />
      <span className="cloud cloud-b" />
      <span className="cloud cloud-c" />
      <span className="cloud cloud-d" />
    </div>
  );
}

export function StickyNote() {
  const [done, setDone] = useState([]);
  return (
    <aside className="sticky" aria-label="To-do note">
      <h2>TODO.txt</h2>
      <ul>
        {stickyNote.map((t, i) => (
          <li key={t}>
            <label>
              <input type="checkbox" checked={done.includes(i)}
                onChange={() => setDone(done.includes(i) ? done.filter((d) => d !== i) : [...done, i])} />
              <span>{t}</span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Watermark({ onActivate }) {
  return (
    <button type="button" className="watermark" onClick={onActivate}>
      <strong>{watermark.title}</strong>
      <span>{watermark.line}</span>
    </button>
  );
}

// Right-click menu for the empty desktop. Items: { label, run }.
export function ContextMenu({ items }) {
  const [at, setAt] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const area = document.getElementById('desktop');
    const onCtx = (e) => {
      if (e.target.closest('.win, .sticky, input, a')) return;
      e.preventDefault();
      const r = area.getBoundingClientRect();
      setAt({ x: Math.min(e.clientX - r.left, r.width - 220), y: Math.min(e.clientY - r.top, r.height - 40 * items.length - 12) });
    };
    area.addEventListener('contextmenu', onCtx);
    return () => area.removeEventListener('contextmenu', onCtx);
  }, [items.length]);

  useEffect(() => {
    if (!at) return;
    ref.current?.querySelector('button')?.focus();
    const off = (e) => { if (!ref.current?.contains(e.target)) setAt(null); };
    const esc = (e) => { if (e.key === 'Escape') { e.stopPropagation(); setAt(null); } };
    document.addEventListener('pointerdown', off);
    document.addEventListener('keydown', esc, true);
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc, true); };
  }, [at]);

  if (!at) return null;
  return (
    <ul className="menu-drop ctx" role="menu" ref={ref} style={{ left: at.x, top: at.y }}>
      {items.map((it) => it.sep
        ? <li key={it.sep} className="start-sep" role="separator" />
        : (
          <li key={it.label} role="none">
            <button type="button" role="menuitem" onClick={() => { setAt(null); it.run(); }}>{it.label}</button>
          </li>
        ))}
    </ul>
  );
}

// Falling-code wallpaper, drawn on a canvas while Display's "Code rain" is picked (data-wall="rain").
// ~20 fps; one still frame under reduced motion. rAF pauses by itself in hidden tabs.
const RAIN_CHARS = '01CTRLZ+{}[]<>/=;HACKHCC$#';
const RAIN_SIZE = 18;
export function CodeRain() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const check = () => setOn(root.dataset.wall === 'rain');
    check();
    const mo = new MutationObserver(check);
    mo.observe(root, { attributes: true, attributeFilter: ['data-wall'] });
    return () => mo.disconnect();
  }, []);

  useEffect(() => {
    if (!on) return;
    const cv = ref.current, ctx = cv.getContext('2d');
    const css = getComputedStyle(document.documentElement);
    const [ink, green, cream, font] = ['--ink', '--green', '--cream', '--f-bios'].map((v) => css.getPropertyValue(v).trim());
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let cols = [];
    const frame = () => {
      ctx.globalAlpha = 0.16; ctx.fillStyle = ink; ctx.fillRect(0, 0, cv.width, cv.height); // fade the trails
      ctx.globalAlpha = 1; ctx.font = `${RAIN_SIZE}px ${font}`;
      cols.forEach((y, i) => {
        ctx.fillStyle = Math.random() < 0.08 ? cream : green;
        ctx.fillText(RAIN_CHARS[(Math.random() * RAIN_CHARS.length) | 0], i * RAIN_SIZE, y * RAIN_SIZE);
        cols[i] = y * RAIN_SIZE > cv.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    const size = () => {
      cv.width = cv.clientWidth; cv.height = cv.clientHeight;
      cols = Array.from({ length: Math.ceil(cv.width / RAIN_SIZE) }, () => Math.floor(Math.random() * (cv.height / RAIN_SIZE + 20)) - 20); // some heads already on screen
      ctx.fillStyle = ink; ctx.fillRect(0, 0, cv.width, cv.height);
      if (still) for (let k = 0; k < 80; k++) frame();
    };
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    let raf, last = 0;
    const tick = (t) => { if (t - last > 50) { last = t; frame(); } raf = requestAnimationFrame(tick); };
    if (!still) raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [on]);

  return on ? <canvas className="rain" ref={ref} aria-hidden="true" /> : null;
}
