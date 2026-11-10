'use client';
import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { initState, reducer, focusedId } from '../../lib/windows.mjs';
import Icon from './icons';
import Window from './Window';
import Taskbar from './Taskbar';
import { Clouds, CodeRain, StickyNote, Watermark, ContextMenu } from './Living';
import About from '../apps/About';
import { play } from '../../lib/sound.mjs';
import { unlock, trackOpened } from '../../lib/achieve.mjs';

// Only About ships in the first bundle; the rest load on hover/focus/open.
const loaders = {
  schedule: () => import('../apps/Schedule'),
  faq: () => import('../apps/Faq'),
  sponsors: () => import('../apps/Sponsors'),
  team: () => import('../apps/Team'),
  terminal: () => import('../apps/Terminal'),
  bughunt: () => import('../apps/BugHunt'),
  pong: () => import('../apps/Pong'),
  solitaire: () => import('../apps/Solitaire'),
  doom: () => import('../apps/Doom'),
  challenge: () => import('../apps/Challenge'),
  dontclick: () => import('../apps/DontClick'),
  display: () => import('../apps/Display'),
  paint: () => import('../apps/Paint'),
  ideas: () => import('../apps/Ideas'),
  sweeper: () => import('../apps/BugSweeper'),
  snake: () => import('../apps/Snake'),
  defrag: () => import('../apps/Defrag'),
};
const Loading = () => <p className="win-loading">Loading…</p>;
const lazy = (id) => dynamic(loaders[id], { loading: Loading });
const Screensaver = dynamic(() => import('./Screensaver'));

// left: shown in the left icon column (event basics plus a few tools) and first in Start. Everything else, on the right.
export const APPS = [
  { id: 'about', left: true, label: 'About.txt', title: 'About.txt — Ctrl Z Edit', icon: 'about', Body: About, w: 620, x: 0.4, y: 0.06 },
  { id: 'schedule', left: true, label: 'Schedule', title: 'Schedule — 24 hours', icon: 'schedule', Body: lazy('schedule'), w: 520, x: 0.1, y: 0.16 },
  { id: 'faq', left: true, label: 'Help', title: 'Help — FAQ and Rules', icon: 'faq', Body: lazy('faq'), w: 560, x: 0.24, y: 0.1 },
  { id: 'sponsors', left: true, label: 'Sponsors', title: 'C:\\SPONSORS', icon: 'sponsors', Body: lazy('sponsors'), w: 540, x: 0.3, y: 0.18 },
  { id: 'team', left: true, label: 'Team', title: 'C:\\TEAM', icon: 'team', Body: lazy('team'), w: 600, x: 0.34, y: 0.06 },
  { id: 'dontclick', left: true, label: 'Don\'t click me', title: 'Don\'t click me', icon: 'dontclick', Body: lazy('dontclick'), w: 560, x: 0.34, y: 0.12 },
  { id: 'terminal', label: 'Terminal', title: 'C:\\> Terminal', icon: 'terminal', Body: lazy('terminal'), w: 600, x: 0.2, y: 0.22 },
  { id: 'bughunt', label: 'Bug Hunt', title: 'Bug Hunt', icon: 'bughunt', Body: lazy('bughunt'), game: true, w: 520, x: 0.26, y: 0.12 },
  { id: 'sweeper', label: 'Bug Sweeper', title: 'Bug Sweeper', icon: 'sweeper', Body: lazy('sweeper'), w: 340, x: 0.42, y: 0.1 },
  { id: 'snake', label: 'SNAKE.BAS', title: 'C:\\GAMES\\SNAKE.BAS', icon: 'snake', Body: lazy('snake'), w: 520, x: 0.3, y: 0.12 },
  { id: 'pong', label: 'Ping Pong', title: 'Ping Pong', icon: 'pong', Body: lazy('pong'), game: true, w: 520, x: 0.32, y: 0.16 },
  { id: 'solitaire', label: 'Solitaire', title: 'Solitaire', icon: 'solitaire', Body: lazy('solitaire'), game: true, w: 800, x: 0.1, y: 0.03 },
  { id: 'challenge', left: true, label: 'Challenge', title: 'Challenge — Can it run Doom?', icon: 'challenge', Body: lazy('challenge'), w: 600, x: 0.6, y: 0.24 },
  { id: 'ideas', left: true, label: 'Ideas.txt', title: 'Ideas.txt — Ctrl Z Edit', icon: 'ideas', Body: lazy('ideas'), w: 520, x: 0.46, y: 0.14 },
  { id: 'defrag', label: 'Defrag', title: 'Disk Defragmenter', icon: 'defrag', Body: lazy('defrag'), w: 540, x: 0.28, y: 0.1 },
  { id: 'paint', left: true, label: 'Paint', title: 'Ctrl Z Paint', icon: 'paint', Body: lazy('paint'), w: 660, x: 0.22, y: 0.08 },
  { id: 'display', left: true, label: 'Display', title: 'Display Properties', icon: 'display', Body: lazy('display'), w: 460, x: 0.38, y: 0.14 },
  { id: 'doom', label: 'Doom', title: 'Doom', icon: 'doom', Body: lazy('doom'), game: true, w: 680, x: 0.2, y: 0.06 },
];

// Desktop shortcuts to other sites: open in a new tab instead of a window. short: the desktop label (rows fit 2 lines).
export const LINKS = [
  { id: 'coderunners', label: 'HackHCC: CodeRunners 2026', short: 'CodeRunners 2026', href: 'https://coderunners.hackhcc.org/', icon: 'link' },
];

const STORE = 'ctrlz-windows';
const SPOTS = 'ctrlz-icons'; // { [icon id]: [dx, dy] } offsets from each icon's grid slot, saved per browser
// Open on first load, back to front; they pop in in this order.
const INITIAL = ['schedule', 'challenge', 'about'];
const IDLE_MS = 45000;
// Deep links: #schedule opens Schedule. A few friendlier names map to app ids.
const ALIASES = { help: 'faq', rules: 'faq', organizers: 'team', minesweeper: 'sweeper', bugsweeper: 'sweeper', notes: 'ideas', notepad: 'ideas', nibbles: 'snake', register: 'about', freedoom: 'doom' };
// An app id or alias (from a #link or the Terminal) to an app id, or undefined.
export const resolve = (name) => { const n = (name || '').toLowerCase(); return APPS.some((a) => a.id === n) ? n : ALIASES[n]; };
const fromHash = () => resolve(decodeURIComponent(location.hash.slice(1)));
const SFX = { open: 'open', close: 'close', undo: 'undo', minimize: 'click', maximize: 'click' };

export default function Desktop() {
  const [state, dispatch] = useReducer(reducer, INITIAL, initState);
  const [saver, setSaver] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [off, setOff] = useState(false);
  const [spots, setSpots] = useState({});
  useEffect(() => { try { setSpots(JSON.parse(localStorage.getItem(SPOTS)) || {}); } catch {} }, []);
  const saveSpots = (next) => { setSpots(next); try { localStorage.setItem(SPOTS, JSON.stringify(next)); } catch {} };
  const moveIcon = useCallback((id, at) => setSpots((cur) => { const next = { ...cur, [id]: at }; try { localStorage.setItem(SPOTS, JSON.stringify(next)); } catch {} return next; }), []);
  const act = useCallback((a) => { play(SFX[a.type]); dispatch(a); }, []); // dispatch with a sound effect

  // Restore open windows for this tab. A first visit on a phone opens only About.txt (or the
  // deep-linked window), since phone windows are full-screen and would just stack.
  useEffect(() => {
    const link = fromHash();
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem(STORE)); } catch {}
    if (saved) dispatch({ type: 'restore', state: saved });
    else if (matchMedia('(max-width: 640px)').matches) dispatch({ type: 'restore', state: initState([link || 'about']) });
    if (link) dispatch({ type: 'open', id: link });
    const onHash = () => { const id = fromHash(); if (id) dispatch({ type: 'open', id }); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch {}
    trackOpened(Object.keys(state.wins), APPS.length); // wins only gets a key once a window has opened
    if (state.rewound) unlock('undo');
  }, [state]);

  // Ctrl+Z / Cmd+Z reopens the last closed window. Esc closes the focused one.
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, [contenteditable="true"], .game')) return;
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        act({ type: 'undo' });
      } else if (e.key === 'Escape' && !document.querySelector('.start-menu, .menu-drop, .msgbox')) {
        const id = focusedId(state);
        // Games keep Esc for themselves (pause, menus); close them with the X button.
        if (id && !APPS.find((a) => a.id === id)?.game) act({ type: 'close', id });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state]);

  // Screensaver after IDLE_MS without input. Never while Doom or the video is open: input inside their iframes never reaches this page.
  useEffect(() => {
    if (saver || state.wins.doom?.open || state.wins.dontclick?.open) return;
    let t = setTimeout(() => setSaver(true), IDLE_MS);
    const reset = () => { clearTimeout(t); t = setTimeout(() => setSaver(true), IDLE_MS); };
    const evs = ['pointermove', 'pointerdown', 'keydown', 'wheel'];
    evs.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    return () => { clearTimeout(t); evs.forEach((ev) => window.removeEventListener(ev, reset)); };
  }, [saver, state.wins.doom?.open, state.wins.dontclick?.open]);

  // The address bar follows the front window, so copying the URL shares that window.
  const top = focusedId(state);
  useEffect(() => { history.replaceState(null, '', top ? `#${top}` : location.pathname + location.search); }, [top]);

  const open = useCallback((id) => act({ type: 'open', id }), [act]);
  const shutDown = useCallback(() => { unlock('shutdown'); setOff(true); }, []);
  const exitSaver = useCallback(() => setSaver(false), []);
  const prefetch = (id) => loaders[id]?.();

  const ctxItems = [
    { label: 'Refresh', run: () => setRefresh((n) => n + 1) },
    { label: 'Arrange icons', run: () => saveSpots({}) },
    { label: 'Open Terminal', run: () => open('terminal') },
    { label: 'Start screensaver', run: () => setSaver(true) },
    { label: 'Display properties', run: () => open('display') },
    { sep: 'a' },
    { label: 'About Ctrl Z OS', run: () => open('about') },
    { label: 'Shut down', run: shutDown },
  ];

  return (
    <div className="desktop">
      <main className="desktop-area" id="desktop">
        <CodeRain />
        <Clouds />
        <h1 className="sr-only">HackHCC Ctrl Z — a 24-hour hackathon at Houston City College</h1>
        {/* Event basics and tools on the left (shortcuts right after About.txt, Undo Bin last); games and extras on the right. */}
        <ul className="icons" aria-label="Event info and tools" key={`l${refresh}`}>
          {[APPS[0], ...LINKS, ...APPS.filter((a) => a.left).slice(1)].map((app, i) => <DesktopIcon key={app.id} app={app} i={i} open={open} prefetch={prefetch} at={spots[app.id]} onMove={moveIcon} />)}
          <DesktopIcon app={{ id: 'undobin', icon: 'undo', label: 'Undo Bin' }} i={APPS.length + LINKS.length} at={spots.undobin} onMove={moveIcon}
            open={() => act({ type: 'undo' })} disabled={!state.closed.length}
            aria={`Undo bin: reopen last closed window (${state.closed.length} in history)`} />
        </ul>
        <ul className="icons icons-right" aria-label="Apps and games" key={`r${refresh}`}>
          {APPS.filter((a) => !a.left).map((app, i) => <DesktopIcon key={app.id} app={app} i={i + 12} open={open} prefetch={prefetch} at={spots[app.id]} onMove={moveIcon} />)}
        </ul>
        <StickyNote />
        <Watermark onActivate={() => open('about')} />

        {!off && APPS.map(({ id, title, icon, Body, w, x, y }) => {
          const win = state.wins[id];
          if (!win?.open) return null;
          return (
            <Window key={id} id={id} title={title} icon={icon} width={w} win={win} defaultPos={{ x, y }}
              focused={top === id} rewound={state.rewound === id} dispatch={act} openDelay={Math.max(0, INITIAL.indexOf(id)) * 140}>
              <Body onOpen={open} onUndo={() => act({ type: 'undo' })} canUndo={state.closed.length > 0}
                onClose={() => act({ type: 'close', id })} onSaver={() => setSaver(true)} active={top === id} />
            </Window>
          );
        })}
        <ContextMenu items={ctxItems} />
      </main>
      <Taskbar apps={APPS} links={LINKS} state={state} top={top} dispatch={act} onShutdown={shutDown} />
      {saver && <Screensaver onExit={exitSaver} />}
      {off && <ShutDown />}
    </div>
  );
}

// One desktop icon: an app button (prefetches its window on hover/focus) or a link that opens a new tab.
// Drag it with the mouse to move it; `at` is its saved offset from its grid slot. Phones keep the grid (CSS).
function DesktopIcon({ app, i, open, prefetch, at, onMove, disabled, aria }) {
  const moved = useRef(false); // true right after a drag, so the click that follows does not open the app
  const onPointerDown = (e) => {
    if (e.button !== 0 || e.pointerType === 'touch' || matchMedia('(max-width: 640px)').matches) return;
    const li = e.currentTarget, r0 = li.getBoundingClientRect(), area = li.closest('.desktop-area').getBoundingClientRect();
    const start = [e.clientX, e.clientY], base = at || [0, 0];
    let to = null;
    const move = (ev) => {
      const dx = ev.clientX - start[0], dy = ev.clientY - start[1];
      if (!to && Math.hypot(dx, dy) < 6) return; // a small wobble is still a click
      // Keep the whole icon on the desktop.
      to = [base[0] + Math.max(area.left - r0.left, Math.min(dx, area.right - r0.right)), base[1] + Math.max(area.top - r0.top, Math.min(dy, area.bottom - r0.bottom))];
      li.style.translate = `${to[0]}px ${to[1]}px`;
      li.classList.add('is-dragging');
    };
    const up = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up);
      li.classList.remove('is-dragging');
      if (!to) return;
      moved.current = true; setTimeout(() => { moved.current = false; }, 0);
      onMove(app.id, to.map(Math.round));
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  };
  return (
    <li style={{ '--i': i, translate: at ? `${at[0]}px ${at[1]}px` : undefined }} onPointerDown={onPointerDown}
      onClickCapture={(e) => { if (moved.current) { e.preventDefault(); e.stopPropagation(); } }}>
      {app.href ? (
        <a className="icon" href={app.href} target="_blank" rel="noopener noreferrer" draggable={false} title={app.label} aria-label={`${app.label} (opens in a new tab)`}>
          <Icon name={app.icon} size={36} />
          <span>{app.short || app.label}</span>
        </a>
      ) : (
        <button type="button" className="icon" onClick={() => open(app.id)} disabled={disabled} aria-label={aria}
          onPointerEnter={() => prefetch?.(app.id)} onFocus={() => prefetch?.(app.id)}>
          <Icon name={app.icon} size={36} />
          <span>{app.label}</span>
        </button>
      )}
    </li>
  );
}

// "It's now safe to turn off your computer." Any key or click reboots: a reload with the boot intro again.
function ShutDown() {
  useEffect(() => {
    const reboot = () => {
      try { sessionStorage.removeItem('booted'); sessionStorage.removeItem(STORE); } catch {}
      location.replace(location.pathname + location.search);
    };
    let ready = false;
    const t = setTimeout(() => { ready = true; }, 1100); // ignore input until the message shows
    const go = () => ready && reboot();
    window.addEventListener('keydown', go);
    window.addEventListener('pointerdown', go);
    return () => { clearTimeout(t); window.removeEventListener('keydown', go); window.removeEventListener('pointerdown', go); };
  }, []);
  return (
    <button type="button" className="shutdown" autoFocus aria-label="Shut down. Press any key to restart.">
      <strong>It's now safe to turn off your computer.</strong>
      <span>Press any key or tap to restart.</span>
    </button>
  );
}
