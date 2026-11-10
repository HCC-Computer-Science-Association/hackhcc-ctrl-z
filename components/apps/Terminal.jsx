'use client';
import { useEffect, useRef, useState } from 'react';
import { event, schedule, faq } from '../../content';
import { ACHIEVEMENTS, unlocked, unlock } from '../../lib/achieve.mjs';

const OPENERS = { about: 'about', schedule: 'schedule', faq: 'faq', sponsors: 'sponsors', bughunt: 'bughunt', pong: 'pong', solitaire: 'solitaire', doom: 'doom', freedoom: 'doom', challenge: 'challenge', display: 'display' };
const TBA = (v) => v || 'TBA';

const HELP = [
  'Commands:',
  '  about  schedule  faq  sponsors   open a window',
  '  bughunt  pong  solitaire  doom   play a game',
  '  challenge         can it run Doom?',
  '  achievements      what you have unlocked',
  '  display           wallpaper and screensaver',
  '  register          how to sign up',
  '  info              event facts',
  '  date  ver  whoami  echo <text>',
  '  undo              reopen the last closed window',
  '  screensaver  hack  clear  exit',
];

const BANNER = ['Ctrl Z OS [Version 1.0]', 'HackHCC Ctrl Z. Type "help" and press Enter.', ''];

export default function Terminal({ onOpen, onUndo, onClose, onSaver }) {
  const [lines, setLines] = useState(BANNER);
  const [input, setInput] = useState('');
  const [hist, setHist] = useState([]);
  const [hi, setHi] = useState(-1);
  const [busy, setBusy] = useState(false);
  const out = useRef(null);
  const inp = useRef(null);

  useEffect(() => { out.current.scrollTop = out.current.scrollHeight; }, [lines]);
  useEffect(() => { inp.current?.focus(); }, []);

  const print = (...l) => setLines((prev) => [...prev, ...l]);

  // A fake "hack" that types out progress lines, then admits the truth.
  const hack = () => {
    const steps = ['Bypassing mainframe...', 'Reversing the polarity...', 'Downloading more RAM...', 'Compiling 24 hours of caffeine...', 'Access granted. Just kidding: register to hack for real.'];
    setBusy(true);
    unlock('hacker');
    steps.forEach((s, i) => setTimeout(() => { print(s); if (i === steps.length - 1) setBusy(false); }, 450 * (i + 1)));
  };

  const run = (raw) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const c = (cmd || '').toLowerCase();
    print(`C:\\> ${raw}`);
    if (!c) return;
    if (OPENERS[c]) { onOpen(OPENERS[c]); print(`Opening ${c}...`, ''); return; }
    switch (c) {
      case 'help': case '?': print(...HELP, ''); break;
      case 'info': print(`${event.name}: ${event.hours} hours at ${event.school}.`, `Date:  ${TBA(event.dateLabel)}`, `Venue: ${TBA(event.venue)}`, ''); break;
      case 'register':
        if (event.registerUrl) { window.open(event.registerUrl, '_blank', 'noopener'); print('Opening registration...', ''); }
        else print('Registration opens soon. Link: TBA.', '');
        break;
      case 'date': print(new Date().toString(), ''); break;
      case 'ver': print('Ctrl Z OS 1.0 (build 2027)', ''); break;
      case 'whoami': print('a future HackHCC hacker', ''); break;
      case 'echo': print(args.join(' '), ''); break;
      case 'undo': onUndo(); print('Undo: reopened the last closed window (if any).', ''); break;
      case 'screensaver': onSaver(); break;
      case 'hack': hack(); break;
      case 'achievements': {
        const have = unlocked();
        print(...ACHIEVEMENTS.map((a) => `  [${have.includes(a.id) ? 'x' : ' '}] ${a.name.padEnd(16)} ${a.how}`), `  ${have.length} of ${ACHIEVEMENTS.length} unlocked`, '');
        break;
      }
      case 'clear': case 'cls': setLines([]); break;
      case 'exit': onClose(); break;
      case 'sudo': print('Nice try. This is 1995. There is no sudo.', ''); break;
      case 'ls': case 'dir': print(' ABOUT.TXT  SCHEDULE  HELP  SPONSORS  BUGHUNT.EXE  PONG.EXE  SOLITAIR.EXE  FREEDOOM.EXE  DISPLAY.CPL', ''); break;
      case 'agenda': print(...schedule.map((s) => `  H+${String(s.hour).padEnd(3)} ${s.title}`), '  (sample schedule, not final)', ''); break;
      case 'questions': print(...faq.map((f) => `  - ${f.q}`), ''); break;
      default: print(`'${cmd}' is not recognized as a command. Type "help".`, '');
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !busy) {
      run(input);
      if (input.trim()) setHist([input, ...hist].slice(0, 30));
      setInput(''); setHi(-1);
    } else if (e.key === 'ArrowUp' && hist.length) {
      e.preventDefault(); const n = Math.min(hi + 1, hist.length - 1); setHi(n); setInput(hist[n]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault(); const n = hi - 1; setHi(n); setInput(n < 0 ? '' : hist[n]);
    }
  };

  return (
    <div className="term" onClick={() => inp.current?.focus()}>
      <div className="term-out" ref={out} role="log" aria-live="polite">
        {lines.map((l, i) => <div key={i}>{l || '\u00a0'}</div>)}
        <label className="term-line">
          <span aria-hidden="true">C:\&gt;&nbsp;</span>
          <span className="sr-only">Command</span>
          <input ref={inp} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={onKeyDown}
            spellCheck="false" autoComplete="off" autoCapitalize="off" disabled={busy} />
        </label>
      </div>
    </div>
  );
}
