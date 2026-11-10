'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from './icons';
import { countdown } from '../../lib/time.mjs';
import { event, tips } from '../../content';
import { play, soundOn, setSound } from '../../lib/sound.mjs';

function useNow(ms) {
  const [now, setNow] = useState(null); // null on the server: no hydration mismatch
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

// Tray balloon: a new tip every 25 s, first one 8 s after load. Dismissed balloons stay gone.
function useTip() {
  const [tip, setTip] = useState(-1);
  const [off, setOff] = useState(false);
  useEffect(() => {
    if (off) return;
    let i = -1;
    const show = () => { i = (i + 1) % tips.length; setTip(i); setTimeout(() => setTip(-1), 9000); };
    const first = setTimeout(show, 8000);
    const t = setInterval(show, 25000);
    return () => { clearTimeout(first); clearInterval(t); };
  }, [off]);
  return [off ? -1 : tip, () => setOff(true)];
}

// Achievement balloon: shown for 6 s when lib/achieve.mjs announces an unlock.
function useAchievement() {
  const [got, setGot] = useState(null);
  useEffect(() => {
    let t;
    const on = (e) => { play('achieve'); setGot(e.detail); clearTimeout(t); t = setTimeout(() => setGot(null), 6000); };
    window.addEventListener('ctrlz-achieve', on);
    return () => { clearTimeout(t); window.removeEventListener('ctrlz-achieve', on); };
  }, []);
  return got;
}

export default function Taskbar({ apps, links, state, top, dispatch, onShutdown }) {
  const [menu, setMenu] = useState(false);
  const [tip, dismissTip] = useTip();
  const got = useAchievement();
  const [sound, setSoundState] = useState(false);
  useEffect(() => setSoundState(soundOn()), []);
  const toggleSound = () => { setSound(!sound); setSoundState(!sound); };
  const menuRef = useRef(null);
  const startRef = useRef(null);
  const now = useNow(30000);
  const left = now && countdown(event.start, now);
  const lives = 3 - Math.min(state.closed.length, 3); // closing a window drains a heart; Ctrl+Z refills it

  // Close the Start menu on outside click or Esc; focus its first item when it opens.
  useEffect(() => {
    if (!menu) return;
    menuRef.current?.querySelector('button')?.focus();
    const off = (e) => { if (!menuRef.current?.contains(e.target) && !startRef.current?.contains(e.target)) setMenu(false); };
    const esc = (e) => { if (e.key === 'Escape') { setMenu(false); startRef.current?.focus(); } };
    document.addEventListener('pointerdown', off);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc); };
  }, [menu]);

  const pick = (fn) => { setMenu(false); fn(); };

  return (
    <footer className="taskbar">
      <button ref={startRef} type="button" className={`start${menu ? ' is-pressed' : ''}`} aria-expanded={menu} aria-controls="start-menu" onClick={() => setMenu(!menu)}>
        <Icon name="register" size={18} />
        <span>Start</span>
      </button>

      {menu && (
        <nav id="start-menu" className="start-menu" ref={menuRef} aria-label="Start menu">
          <div className="start-rail" aria-hidden="true"><span>Ctrl Z OS</span></div>
          <ul>
            {/* Same split as the desktop: event info and the shortcuts first, then the apps and games. */}
            {[apps[0], ...links, ...apps.filter((a) => a.info).slice(1), null, ...apps.filter((a) => !a.info)].map((a) => (a === null
              ? <li key="sep-info" className="start-sep" aria-hidden="true" />
              : (
                <li key={a.id}>
                  {a.href ? (
                    <a href={a.href} target="_blank" rel="noopener noreferrer" onClick={() => setMenu(false)} aria-label={`${a.label} (opens in a new tab)`}>
                      <Icon name={a.icon} size={24} /> {a.label}
                    </a>
                  ) : (
                    <button type="button" onClick={() => pick(() => dispatch({ type: 'open', id: a.id }))}>
                      <Icon name={a.icon} size={24} /> {a.label}
                    </button>
                  )}
                </li>
              )))}
            <li className="start-sep" aria-hidden="true" />
            <li>
              <button type="button" disabled={!state.closed.length} onClick={() => pick(() => dispatch({ type: 'undo' }))}>
                <Icon name="undo" size={24} /> Undo close <kbd>Ctrl+Z</kbd>
              </button>
            </li>
            <li>
              <button type="button" onClick={() => pick(onShutdown)}>
                <Icon name="power" size={24} /> Shut Down…
              </button>
            </li>
          </ul>
        </nav>
      )}

      <ul className="tasks" aria-label="Open windows">
        {apps.filter((a) => state.wins[a.id]?.open).map((a) => {
          const active = top === a.id;
          return (
            <li key={a.id}>
              <button type="button" className={`task${active ? ' is-pressed' : ''}`} aria-pressed={active} aria-label={a.label}
                onClick={() => dispatch({ type: active ? 'minimize' : 'focus', id: a.id })}>
                <Icon name={a.icon} size={16} /> <span>{a.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="balloon-slot" aria-live="polite">
        {got ? (
          <div className="balloon is-achieve" key={got.id}>
            <strong>Achievement unlocked: {got.name}</strong>
            <p>{got.how} Type “achievements” in the Terminal to see them all.</p>
          </div>
        ) : tip >= 0 && !Object.values(state.wins).some((w) => w.open && w.max && !w.min) && (
          <div className="balloon" key={tip}>
            <strong>Ctrl Z OS tip</strong>
            <p>{tips[tip]}</p>
            <button type="button" className="win-btn" aria-label="Turn off tips" onClick={dismissTip}>
              <svg viewBox="0 0 8 8" width="8" height="8" aria-hidden="true" shapeRendering="crispEdges">
                <path d="M0 0h2v1h1v1h2V1h1V0h2v1H7v1H6v1H5v2h1v1h1v1h1v1H6V7H5V6H3v1H2v1H0V7h1V6h1V5h1V3H2V2H1V1H0z" fill="currentColor" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="tray">
        <button type="button" className="tray-btn" aria-pressed={sound} aria-label="Sound effects" onClick={toggleSound}
          title={sound ? 'Sound on. Click to mute.' : 'Sound off. Click to turn on.'}>
          <Icon name={sound ? 'speaker' : 'mute'} size={18} />
        </button>
        <button type="button" className="lives" disabled={!state.closed.length} onClick={() => dispatch({ type: 'undo' })}
          title="Undo history. Click or press Ctrl+Z to reopen a closed window."
          aria-label={`Undo history: ${state.closed.length} closed window${state.closed.length === 1 ? '' : 's'}. Reopen last.`}>
          {[0, 1, 2].map((i) => <Icon key={i} name={i < lives ? 'heart' : 'heartEmpty'} size={14} />)}
        </button>
        <div className="countdown" title={event.start ? 'Time until hacking starts' : 'Event date TBA'}>
          <span className="meter" aria-hidden="true"><span className={left ? undefined : 'idle'} style={{ '--fill': left ? Math.max(0.04, 1 - left.d / 120) : 1 }} /></span>
          <span>{left ? `T-${left.d}d ${left.h}h` : 'T-minus TBA'}</span>
        </div>
        <time className="clock" suppressHydrationWarning>
          {now ? new Date(now).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : ''}
        </time>
      </div>
    </footer>
  );
}
