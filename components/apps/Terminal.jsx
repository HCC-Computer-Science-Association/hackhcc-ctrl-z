'use client';
import { useEffect, useRef, useState } from 'react';
import { event, schedule, faq } from '../../content';
import { ACHIEVEMENTS, unlocked, unlock } from '../../lib/achieve.mjs';
import { complete, closest } from '../../lib/complete.mjs';

const OPENERS = { about: 'about', schedule: 'schedule', faq: 'faq', sponsors: 'sponsors', team: 'team', bughunt: 'bughunt', pong: 'pong', solitaire: 'solitaire', doom: 'doom', freedoom: 'doom', challenge: 'challenge', display: 'display', paint: 'paint' };
const TBA = (v) => v || 'TBA';
const HIST_KEY = 'ctrlz-term-history';

// Every command, with the one-line help text. Tab completion and "did you mean" read this list.
const DOCS = {
  help: 'list commands',
  about: 'open About.txt', schedule: 'open the schedule', faq: 'open FAQ and rules', sponsors: 'open sponsors', team: 'meet the organizers',
  bughunt: 'play Bug Hunt', pong: 'play Ping Pong', solitaire: 'play Solitaire', doom: 'play Doom', freedoom: 'play Doom',
  challenge: 'can it run Doom?', display: 'wallpaper, CRT and screensaver', paint: 'open Ctrl Z Paint',
  info: 'event facts', register: 'how to sign up', agenda: 'print the schedule', questions: 'print the FAQ questions',
  achievements: 'what you have unlocked', neofetch: 'system info', matrix: 'code rain wallpaper on or off', rain: 'code rain wallpaper on or off',
  history: 'commands you ran', '!!': 'run the last command again',
  date: 'today\'s date', ver: 'OS version', whoami: 'who are you?', echo: 'print text', ls: 'list files', dir: 'list files',
  undo: 'reopen the last closed window', screensaver: 'start the screensaver', hack: 'hack the mainframe',
  clear: 'clear the screen (Ctrl+L)', cls: 'clear the screen', exit: 'close the Terminal', sudo: 'try it',
};
const COMMANDS = Object.keys(DOCS);
const HELP = [
  'Commands:',
  ...['about schedule faq sponsors team challenge display paint', 'bughunt pong solitaire doom', 'info register agenda questions achievements',
    'history !! neofetch matrix date ver whoami echo ls', 'undo screensaver hack clear exit'].map((l) => `  ${l}`),
  '',
  'Tab completes a command. Up and Down walk through history.',
  'Ctrl+L clears the screen. Ctrl+C cancels the line. "help <command>" explains one.',
];
const NEOFETCH = [
  '   ___________      visitor@ctrl-z-os',
  '  |  _______  |     -----------------',
  '  | | CTRL  | |     OS: Ctrl Z OS 1.0',
  '  | |  + Z  | |     Host: HackHCC, Houston City College',
  '  | |_______| |     Uptime: 24 hours (planned)',
  '  |___________|     Shell: C:\\> 1.0',
  '   _|_____|_        Memory: 640K (should be enough)',
  '  |_________|       Date: ' + TBA(event.dateLabel),
];
const BANNER = ['Ctrl Z OS [Version 1.0]', 'HackHCC Ctrl Z. Type "help" and press Enter. Tab completes commands.', ''];

const loadHist = () => { try { return JSON.parse(sessionStorage.getItem(HIST_KEY)) || []; } catch { return []; } };

export default function Terminal({ onOpen, onUndo, onClose, onSaver }) {
  const [lines, setLines] = useState(BANNER); // a string, or { t, k } with k = 'cmd' | 'err' | 'dim'
  const [input, setInput] = useState('');
  const [hist, setHist] = useState([]); // newest first
  const [hi, setHi] = useState(-1); // -1: editing a fresh line
  const [busy, setBusy] = useState(false);
  const draft = useRef('');
  const out = useRef(null);
  const inp = useRef(null);

  useEffect(() => { setHist(loadHist()); inp.current?.focus(); }, []);
  useEffect(() => { out.current.scrollTop = out.current.scrollHeight; }, [lines]);
  useEffect(() => { try { sessionStorage.setItem(HIST_KEY, JSON.stringify(hist)); } catch {} }, [hist]);
  useEffect(() => { if (!busy) inp.current?.focus(); }, [busy]);

  const print = (...l) => setLines((prev) => [...prev, ...l]);
  const err = (t) => print({ t, k: 'err' }, '');

  // A fake "hack" that types out progress lines, then admits the truth.
  const hack = () => {
    const steps = ['Bypassing mainframe...', 'Reversing the polarity...', 'Downloading more RAM...', 'Compiling 24 hours of caffeine...', 'Access granted. Just kidding: register to hack for real.'];
    setBusy(true);
    unlock('hacker');
    steps.forEach((s, i) => setTimeout(() => { print(s); if (i === steps.length - 1) { print(''); setBusy(false); } }, 450 * (i + 1)));
  };

  const run = (raw, history) => {
    const [cmd, ...args] = raw.trim().split(/\s+/);
    const c = (cmd || '').toLowerCase();
    print({ t: `C:\\> ${raw}`, k: 'cmd' });
    if (!c) return;
    if (OPENERS[c]) { onOpen(OPENERS[c]); print(`Opening ${c}...`, ''); return; }
    switch (c) {
      case 'help': case '?': {
        const about = args[0]?.toLowerCase();
        if (!about) print(...HELP, '');
        else if (DOCS[about]) print(`  ${about}: ${DOCS[about]}`, '');
        else err(`No help for '${args[0]}'.`);
        break;
      }
      case 'info': print(`${event.name}: ${event.hours} hours at ${event.school}.`, `Date:  ${TBA(event.dateLabel)}`, `Venue: ${TBA(event.venue)}`, ''); break;
      case 'register':
        if (event.registerUrl) { window.open(event.registerUrl, '_blank', 'noopener'); print('Opening registration...', ''); }
        else print('Registration opens soon. Link: TBA.', '');
        break;
      case 'history':
        if (!history.length) print({ t: '  (no commands yet)', k: 'dim' }, '');
        else print(...[...history].reverse().map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`), '');
        break;
      case 'neofetch': print(...NEOFETCH, ''); break;
      case 'matrix': case 'rain': { // same setting as Display > Wallpaper
        const root = document.documentElement, next = root.dataset.wall === 'rain' ? 'checker' : 'rain';
        root.dataset.wall = next;
        try { localStorage.setItem('ctrlz-wall', next); } catch {}
        print(next === 'rain' ? 'Follow the green code. Type "matrix" again to switch it off.' : 'Back to the checker wallpaper.', '');
        break;
      }
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
      case 'sudo': err('Nice try. This is 1995. There is no sudo.'); break;
      case 'ls': case 'dir': print(' ABOUT.TXT  SCHEDULE  HELP  SPONSORS  TEAM  BUGHUNT.EXE  PONG.EXE  SOLITAIR.EXE  DOOM.EXE  DISPLAY.CPL  PAINT.EXE', ''); break;
      case 'agenda': print(...schedule.map((s) => `  H+${String(s.hour).padEnd(3)} ${s.title}`), { t: '  (sample schedule, not final)', k: 'dim' }, ''); break;
      case 'questions': print(...faq.map((f) => `  - ${f.q}`), ''); break;
      default: {
        const guess = closest(c, COMMANDS);
        err(`'${cmd}' is not recognized as a command.${guess ? ` Did you mean "${guess}"?` : ' Type "help".'}`);
      }
    }
  };

  // The unique command the current input could complete to, shown greyed after the cursor.
  const word = input.trimStart();
  const { matches, common } = complete(word, COMMANDS);
  const ghost = word && !word.includes(' ') && matches.length === 1 ? common.slice(word.length) : '';

  const submit = () => {
    let line = input;
    if (line.trim() === '!!') {
      if (!hist[0]) { print({ t: 'C:\\> !!', k: 'cmd' }); err('No previous command.'); setInput(''); return; }
      line = hist[0];
    }
    const next = line.trim() && line !== hist[0] ? [line, ...hist].slice(0, 50) : hist;
    run(line, next);
    setHist(next);
    setInput(''); setHi(-1);
  };

  const tab = () => {
    if (!word || word.includes(' ')) return;
    if (matches.length === 1) setInput(`${common} `);
    else if (common.length > word.length) setInput(common);
    else if (matches.length) print({ t: `C:\\> ${input}`, k: 'cmd' }, matches.join('  '), '');
  };

  const walk = (dir) => { // dir 1 = older, -1 = newer
    if (!hist.length) return;
    if (hi === -1) draft.current = input;
    const n = Math.max(-1, Math.min(hi + dir, hist.length - 1));
    setHi(n); setInput(n === -1 ? draft.current : hist[n]);
  };

  const onKeyDown = (e) => {
    const end = e.currentTarget.selectionStart === input.length;
    if (e.key === 'Enter') submit();
    else if (e.key === 'Tab') { e.preventDefault(); tab(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); walk(1); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); walk(-1); }
    else if (e.key === 'ArrowRight' && ghost && end) { e.preventDefault(); setInput(input + ghost); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setLines([]); }
    else if (e.ctrlKey && e.key.toLowerCase() === 'c' && !getSelection()?.toString()) { e.preventDefault(); print({ t: `C:\\> ${input}^C`, k: 'cmd' }); setInput(''); setHi(-1); }
  };

  return (
    // Click anywhere to type, unless the visitor is selecting output to copy.
    <div className="term" onClick={() => { if (!getSelection()?.toString()) inp.current?.focus(); }}>
      <div className="term-out" ref={out} role="log" aria-live="polite">
        {lines.map((l, i) => (typeof l === 'string'
          ? <div key={i}>{l || '\u00a0'}</div>
          : <div key={i} className={`term-${l.k}`}>{l.t}</div>))}
        <label className="term-line">
          <span aria-hidden="true">C:\&gt;&nbsp;</span>
          <span className="sr-only">Command. Tab completes, up and down arrows browse history.</span>
          <span className="term-field">
            <input ref={inp} value={input} onChange={(e) => { setInput(e.target.value); setHi(-1); }} onKeyDown={onKeyDown}
              spellCheck="false" autoComplete="off" autoCapitalize="off" disabled={busy} />
            {ghost && <span className="term-ghost" aria-hidden="true"><span>{input}</span>{ghost}</span>}
          </span>
        </label>
      </div>
    </div>
  );
}
