'use client';
import { useCallback, useEffect, useReducer, useState } from 'react';
import dynamic from 'next/dynamic';
import { initState, reducer, focusedId } from '../../lib/windows.mjs';
import Icon from './icons';
import Window from './Window';
import Taskbar from './Taskbar';
import { Clouds, StickyNote, Watermark, ContextMenu } from './Living';
import About from '../apps/About';

// Only About ships in the first bundle; the rest load on hover/focus/open.
const loaders = {
  schedule: () => import('../apps/Schedule'),
  faq: () => import('../apps/Faq'),
  sponsors: () => import('../apps/Sponsors'),
  terminal: () => import('../apps/Terminal'),
  bughunt: () => import('../apps/BugHunt'),
  pong: () => import('../apps/Pong'),
  solitaire: () => import('../apps/Solitaire'),
  doom: () => import('../apps/Doom'),
  challenge: () => import('../apps/Challenge'),
  dontclick: () => import('../apps/DontClick'),
};
const Loading = () => <p className="win-loading">Loading…</p>;
const lazy = (id) => dynamic(loaders[id], { loading: Loading });
const Screensaver = dynamic(() => import('./Screensaver'));

export const APPS = [
  { id: 'about', label: 'About.txt', title: 'About.txt — Ctrl Z Edit', icon: 'about', Body: About, w: 620, x: 0.4, y: 0.06 },
  { id: 'schedule', label: 'Schedule', title: 'Schedule — 24 hours', icon: 'schedule', Body: lazy('schedule'), w: 520, x: 0.1, y: 0.16 },
  { id: 'faq', label: 'Help', title: 'Help — FAQ and Rules', icon: 'faq', Body: lazy('faq'), w: 560, x: 0.24, y: 0.1 },
  { id: 'sponsors', label: 'Sponsors & Team', title: 'C:\\SPONSORS', icon: 'sponsors', Body: lazy('sponsors'), w: 540, x: 0.3, y: 0.18 },
  { id: 'terminal', label: 'Terminal', title: 'C:\\> Terminal', icon: 'terminal', Body: lazy('terminal'), w: 600, x: 0.2, y: 0.22 },
  { id: 'bughunt', label: 'Bug Hunt', title: 'Bug Hunt', icon: 'bughunt', Body: lazy('bughunt'), game: true, w: 520, x: 0.26, y: 0.12 },
  { id: 'pong', label: 'Ping Pong', title: 'Ping Pong', icon: 'pong', Body: lazy('pong'), game: true, w: 520, x: 0.32, y: 0.16 },
  { id: 'solitaire', label: 'Solitaire', title: 'Solitaire', icon: 'solitaire', Body: lazy('solitaire'), game: true, w: 800, x: 0.1, y: 0.03 },
  { id: 'challenge', label: 'Challenge', title: 'Challenge — Can it run Doom?', icon: 'challenge', Body: lazy('challenge'), w: 600, x: 0.6, y: 0.24 },
  { id: 'dontclick', label: 'Don\'t click me', title: 'Don\'t click me', icon: 'dontclick', Body: lazy('dontclick'), w: 560, x: 0.34, y: 0.12 },
  { id: 'doom', label: 'Freedoom', title: 'Freedoom', icon: 'doom', Body: lazy('doom'), game: true, w: 680, x: 0.2, y: 0.06 },
];

const STORE = 'ctrlz-windows';
// Open on first load, back to front; they pop in in this order.
const INITIAL = ['schedule', 'challenge', 'about'];
const IDLE_MS = 45000;

export default function Desktop() {
  const [state, dispatch] = useReducer(reducer, INITIAL, initState);
  const [saver, setSaver] = useState(false);
  const [refresh, setRefresh] = useState(0);

  // Restore open windows for this tab, then keep them saved.
  useEffect(() => {
    try { const saved = JSON.parse(sessionStorage.getItem(STORE)); if (saved) dispatch({ type: 'restore', state: saved }); } catch {}
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch {}
  }, [state]);

  // Ctrl+Z / Cmd+Z reopens the last closed window. Esc closes the focused one.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, [contenteditable="true"], .game')) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        dispatch({ type: 'undo' });
      } else if (e.key === 'Escape' && !document.querySelector('.start-menu, .menu-drop, .msgbox')) {
        const id = focusedId(state);
        // Games keep Esc for themselves (pause, menus); close them with the X button.
        if (id && !APPS.find((a) => a.id === id)?.game) dispatch({ type: 'close', id });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state]);

  // Screensaver after IDLE_MS without input. Never while Freedoom is open (it may be played with no mouse).
  useEffect(() => {
    if (saver || state.wins.doom?.open) return;
    let t = setTimeout(() => setSaver(true), IDLE_MS);
    const reset = () => { clearTimeout(t); t = setTimeout(() => setSaver(true), IDLE_MS); };
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel'];
    evs.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    return () => { clearTimeout(t); evs.forEach((ev) => window.removeEventListener(ev, reset)); };
  }, [saver, state.wins.doom?.open]);

  const open = useCallback((id) => dispatch({ type: 'open', id }), []);
  const exitSaver = useCallback(() => setSaver(false), []);
  const prefetch = (id) => loaders[id]?.();
  const top = focusedId(state);

  const ctxItems = [
    { label: 'Refresh', run: () => setRefresh((n) => n + 1) },
    { label: 'Open Terminal', run: () => open('terminal') },
    { label: 'Start screensaver', run: () => setSaver(true) },
    { sep: 'a' },
    { label: 'About Ctrl Z OS', run: () => open('about') },
  ];

  return (
    <div className="desktop">
      <main className="desktop-area" id="desktop">
        <Clouds />
        <h1 className="sr-only">HackHCC Ctrl Z — a 24-hour hackathon at Houston City College</h1>
        <ul className="icons" aria-label="Desktop" key={refresh}>
          {APPS.map((app, i) => (
            <li key={app.id} style={{ '--i': i }}>
              <button type="button" className="icon" onClick={() => open(app.id)}
                onPointerEnter={() => prefetch(app.id)} onFocus={() => prefetch(app.id)}>
                <Icon name={app.icon} size={36} />
                <span>{app.label}</span>
              </button>
            </li>
          ))}
          <li style={{ '--i': APPS.length }}>
            <button type="button" className="icon" disabled={!state.closed.length}
              onClick={() => dispatch({ type: 'undo' })}
              aria-label={`Undo bin: reopen last closed window (${state.closed.length} in history)`}>
              <Icon name="undo" size={36} />
              <span>Undo Bin</span>
            </button>
          </li>
        </ul>
        <StickyNote />
        <Watermark onActivate={() => open('about')} />

        {APPS.map(({ id, title, icon, Body, w, x, y }) => {
          const win = state.wins[id];
          if (!win?.open) return null;
          return (
            <Window key={id} id={id} title={title} icon={icon} width={w} win={win} defaultPos={{ x, y }}
              focused={top === id} rewound={state.rewound === id} dispatch={dispatch} openDelay={Math.max(0, INITIAL.indexOf(id)) * 140}>
              <Body onOpen={open} onUndo={() => dispatch({ type: 'undo' })} canUndo={state.closed.length > 0}
                onClose={() => dispatch({ type: 'close', id })} onSaver={() => setSaver(true)} active={top === id} />
            </Window>
          );
        })}
        <ContextMenu items={ctxItems} />
      </main>
      <Taskbar apps={APPS} state={state} top={top} dispatch={dispatch} />
      {saver && <Screensaver onExit={exitSaver} />}
    </div>
  );
}
