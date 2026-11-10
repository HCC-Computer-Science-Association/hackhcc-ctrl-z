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
