'use client';
import { useEffect, useRef, useState } from 'react';
import { event, about, challenge } from '../../content';
import Schedule from './Schedule';
import Faq from './Faq';

const BASE = process.env.NEXT_PUBLIC_BASE;
const TBA = <span className="tba">TBA</span>;
const SECTIONS = [['guide', 'How to use'], ['schedule', 'Schedule'], ['faq', 'FAQ'], ['challenge', 'Challenge'], ['team', 'Team']];
// In-window jump: scroll the section into view without changing the #hash (the hash opens windows).
const jump = (id) => (e) => { e.preventDefault(); const el = document.getElementById(`about-${id}`); el?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); el?.focus({ preventScroll: true }); };

export function Menu({ label, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    ref.current.querySelector('[role=menuitem]:not(:disabled)')?.focus();
    const off = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); ref.current.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', off);
    document.addEventListener('keydown', esc, true);
    return () => { document.removeEventListener('pointerdown', off); document.removeEventListener('keydown', esc, true); };
  }, [open]);
  return (
    <div className="menu" ref={ref}>
      <button type="button" aria-haspopup="menu" aria-expanded={open} className={open ? 'is-open' : undefined} onClick={() => setOpen(!open)}>{label}</button>
      {open && (
        <ul className="menu-drop" role="menu">
          {items.map((it) => (
            <li key={it.label} role="none">
              <button type="button" role="menuitem" disabled={it.disabled} onClick={() => { setOpen(false); it.run(); }}>
                {it.label}{it.key && <kbd>{it.key}</kbd>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function About({ onOpen, onUndo, canUndo }) {
  const [msg, setMsg] = useState(false);
  const okRef = useRef(null);
  useEffect(() => { if (msg) okRef.current?.focus(); }, [msg]);

  return (
    <div className="about">
      <nav className="menubar" aria-label="About.txt menu">
        <Menu label="Edit" items={[{ label: 'Undo close', key: 'Ctrl+Z', disabled: !canUndo, run: onUndo }]} />
        <Menu label="Help" items={[{ label: 'FAQ and rules', run: () => onOpen('faq') }, { label: 'Schedule', run: () => onOpen('schedule') }]} />
      </nav>

      <div className="doc">
        <div className="guide">
          <p className="guide-side"><span className="guide-arrow" aria-hidden="true">◀</span><span><strong>Left side:</strong> event info. Schedule, Help, Team, Sponsors, the Doom challenge and a few tools.</span></p>
          <p className="guide-side guide-right"><span><strong>Right side:</strong> games and extras. Terminal, Bug Hunt, Snake, Solitaire and more.</span><span className="guide-arrow" aria-hidden="true">▶</span></p>
        </div>
        <img className="badge" src={`${BASE}/badge.png`} alt="HackHCC Ctrl+Z" width="1161" height="238" />
        <p className="hook">{about.hook}</p>
        {about.body.map((p) => <p key={p} className="prose">{p}</p>)}

        <dl className="facts">
          <div><dt>Length</dt><dd>{event.hours} hours</dd></div>
          <div><dt>Date</dt><dd>{event.dateLabel || TBA}</dd></div>
          <div><dt>Venue</dt><dd>{event.venue || TBA}</dd></div>
        </dl>

        <nav className="toc" aria-label="On this page">
          {SECTIONS.map(([id, label]) => <a key={id} href={`#about-${id}`} onClick={jump(id)}>{label}</a>)}
        </nav>

        <section id="about-guide" tabIndex={-1} aria-labelledby="about-guide-h">
          <h3 id="about-guide-h">Find your way around</h3>
          <ul className="prose steps">
            <li>Click an icon to open it as a window. Drag a window by its title bar.</li>
            <li>Closed something by mistake? Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> (or open the Undo Bin).</li>
            <li><kbd>Esc</kbd> closes the window in front. The <strong>Start</strong> button, bottom left, lists every app.</li>
            <li>Right-click the desktop for more options.</li>
          </ul>
        </section>

        <section id="about-schedule" tabIndex={-1} aria-labelledby="about-schedule-h">
          <h3 id="about-schedule-h">Schedule</h3>
          <Schedule />
        </section>

        <section id="about-faq" tabIndex={-1} aria-label="FAQ and rules">
          <Faq />
        </section>

        <section id="about-challenge" tabIndex={-1} aria-labelledby="about-challenge-h">
          <h3 id="about-challenge-h">Side challenge: can it run Doom?</h3>
          <p className="prose">{challenge.pitch}</p>
          <p className="prose"><button type="button" className="link" onClick={() => onOpen('challenge')}>Open the Challenge</button> for rules and an idea roller.</p>
        </section>

        <section id="about-team" tabIndex={-1} aria-labelledby="about-team-h">
          <h3 id="about-team-h">Team and sponsors</h3>
          <p className="prose">
            Meet the <button type="button" className="link" onClick={() => onOpen('team')}>organizing team</button> or see the{' '}
            <button type="button" className="link" onClick={() => onOpen('sponsors')}>sponsors</button>.
          </p>
        </section>
      </div>

      <div className="statusbar">
        <span>{event.registerUrl ? 'Registration is open' : 'Registration opens soon'}</span>
        {event.registerUrl
          ? <a className="btn btn-primary" href={event.registerUrl} target="_blank" rel="noopener noreferrer">Register</a>
          : <button type="button" className="btn btn-primary" onClick={() => setMsg(true)}>Register</button>}
      </div>

      {msg && (
        <div className="msgbox-scrim">
          <div className="msgbox" role="alertdialog" aria-labelledby="msg-title" aria-describedby="msg-text"
            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setMsg(false); } }}>
            <div className="win-title"><h2 id="msg-title">Register</h2></div>
            <div className="msgbox-body">
              <svg viewBox="0 0 8 8" width="32" height="32" aria-hidden="true" shapeRendering="crispEdges">
                <path fill="#1738bb" d="M2 0h4v1h1v1h1v4H7v1H6v1H2V7H1V6H0V2h1V1h1z" />
                <path fill="#fff" d="M3.5 1.5h1v1h-1zM3.5 3.5h1v3h-1z" />
              </svg>
              <p id="msg-text">Registration opens soon. The sign-up link will be posted here (TBA).</p>
            </div>
            <div className="msgbox-actions"><button ref={okRef} type="button" className="btn" onClick={() => setMsg(false)}>OK</button></div>
          </div>
        </div>
      )}
    </div>
  );
}
