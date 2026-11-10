'use client';
import { useEffect, useLayoutEffect, useRef } from 'react';
import Icon from './icons';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function Window({ id, title, icon, width, win, defaultPos, focused, rewound, dispatch, openDelay = 0, children }) {
  const ref = useRef(null);
  const pos = useRef({ x: win.x, y: win.y });

  // First placement: fraction of the desktop, clamped so the window fits.
  useIso(() => {
    const el = ref.current;
    if (pos.current.x == null) {
      const area = el.parentElement.getBoundingClientRect();
      pos.current = {
        x: Math.max(8, Math.min(area.width * defaultPos.x, area.width - el.offsetWidth - 8)),
        y: Math.max(8, Math.min(area.height * defaultPos.y, area.height - el.offsetHeight - 8)),
      };
    }
    el.style.setProperty('--x', `${pos.current.x}px`);
    el.style.setProperty('--y', `${pos.current.y}px`);
  }, []);

  // Resize from the bottom-right grip. Same pattern as drag: write to the DOM, commit on release.
  const onResize = (e) => {
    if (e.button !== 0 || win.max) return;
    e.preventDefault(); e.stopPropagation();
    const el = ref.current;
    const area = el.parentElement.getBoundingClientRect();
    const start = { px: e.clientX, py: e.clientY, w: el.offsetWidth, h: el.offsetHeight };
    const grip = e.currentTarget;
    grip.setPointerCapture(e.pointerId);
    el.classList.add('dragging', 'has-size');
    let size = { width: start.w, height: start.h };
    const move = (ev) => {
      size = {
        width: Math.round(Math.max(300, Math.min(start.w + ev.clientX - start.px, area.width - pos.current.x))),
        height: Math.round(Math.max(200, Math.min(start.h + ev.clientY - start.py, area.height - pos.current.y))),
      };
      el.style.setProperty('--w', `${size.width}px`);
      el.style.setProperty('--h', `${size.height}px`);
    };
    const up = () => {
      grip.removeEventListener('pointermove', move);
      el.classList.remove('dragging');
      dispatch({ type: 'resize', id, ...size });
    };
    grip.addEventListener('pointermove', move);
    grip.addEventListener('pointerup', up, { once: true });
    grip.addEventListener('pointercancel', up, { once: true });
  };

  // Move focus into a window when it opens or is brought to the front.
  useEffect(() => { if (focused && !win.min) ref.current?.focus({ preventScroll: true }); }, [focused, win.min]);

  // Drag: write the CSS vars straight to the DOM; commit to React once, on release.
  const onPointerDown = (e) => {
    if (e.button !== 0 || win.max || e.target.closest('button') || matchMedia('(max-width: 640px)').matches) return;
    const el = ref.current;
    const area = el.parentElement.getBoundingClientRect();
    const start = { px: e.clientX, py: e.clientY, ...pos.current };
    el.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
    const move = (ev) => {
      pos.current = {
        x: Math.min(Math.max(start.x + ev.clientX - start.px, 40 - el.offsetWidth), area.width - 40),
        y: Math.min(Math.max(start.y + ev.clientY - start.py, 0), area.height - 28),
      };
      el.style.setProperty('--x', `${pos.current.x}px`);
      el.style.setProperty('--y', `${pos.current.y}px`);
    };
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.classList.remove('dragging');
      dispatch({ type: 'move', id, ...pos.current });
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up, { once: true });
    el.addEventListener('pointercancel', up, { once: true });
  };

  return (
    <section ref={ref} role="dialog" aria-labelledby={`${id}-title`} tabIndex={-1}
      className={`win${focused ? ' is-focused' : ''}${rewound ? ' is-rewound' : ''}${win.max ? ' is-max' : ''}${win.height ? ' has-size' : ''}`}
      style={{ zIndex: win.z, '--open-delay': `${openDelay}ms`, '--w': `${win.width || width}px`, ...(win.height && { '--h': `${win.height}px` }) }} hidden={win.min}
      onPointerDownCapture={() => dispatch({ type: 'focus', id })}>
      <header className="win-title" onPointerDown={onPointerDown} onDoubleClick={(e) => !e.target.closest('button') && dispatch({ type: 'maximize', id })}>
        <Icon name={icon} size={16} />
        <h2 id={`${id}-title`}>{title}</h2>
        <button type="button" className="win-btn" aria-label={`Minimize ${title}`} onClick={() => dispatch({ type: 'minimize', id })}>
          <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden="true"><rect x="1" y="6" width="6" height="2" fill="currentColor" /></svg>
        </button>
        <button type="button" className="win-btn win-max" aria-label={`${win.max ? 'Restore' : 'Maximize'} ${title}`} onClick={() => dispatch({ type: 'maximize', id })}>
          <svg viewBox="0 0 9 9" width="9" height="9" aria-hidden="true" shapeRendering="crispEdges">
            {win.max
              ? <path fill="currentColor" d="M2 0h7v6H7V5h1V2H3v1H2zM0 3h7v6H0zm1 2v3h5V5z" />
              : <path fill="currentColor" d="M0 0h9v9H0zm1 2v6h7V2z" />}
          </svg>
        </button>
        <button type="button" className="win-btn" aria-label={`Close ${title}`} onClick={() => dispatch({ type: 'close', id })}>
          <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden="true" shapeRendering="crispEdges">
            <path d="M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v2h1v1h1v1h1v1H6V7H5V6H3v1H2v1H0V7h1V6h1V5h1V3H2V2H1V1H0z" fill="currentColor" />
          </svg>
        </button>
      </header>
      <div className="win-body">{children}</div>
      {!win.max && <span className="win-grip" onPointerDown={onResize} aria-hidden="true" title="Drag to resize" />}
    </section>
  );
}
