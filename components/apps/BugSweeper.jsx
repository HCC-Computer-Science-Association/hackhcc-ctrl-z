'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '../desktop/icons';
import { unlock } from '../../lib/achieve.mjs';
import { newGame, reveal, toggleFlag, count, flagsLeft } from '../../lib/sweeper.mjs';

const W = 9, H = 9, BUGS = 10;
const pad3 = (n) => String(Math.max(-99, Math.min(999, n))).padStart(3, '0');

// Bug Sweeper: open every cell without a bug. Right-click (or Flag mode) marks a bug.
// Ctrl+Z undoes your last click, even the one that hit a bug.
export default function BugSweeper({ active }) {
  const [st, setSt] = useState(() => newGame(W, H, BUGS));
  const [past, setPast] = useState([]); // earlier states, for Ctrl+Z
  const [flagMode, setFlagMode] = useState(false);
  const [cursor, setCursor] = useState(40); // the cell that holds keyboard focus (roving tabindex)
  const [secs, setSecs] = useState(0);
  const grid = useRef(null);

  useEffect(() => {
    if (st.status !== 'play') return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [st.status]);
  useEffect(() => { if (st.status === 'won') unlock('sweeper'); }, [st.status]);

  const commit = (next) => { if (next !== st) { setPast((p) => [...p.slice(-49), st]); setSt(next); } };
  const act = (i, flag) => commit(flag || flagMode ? toggleFlag(st, i) : reveal(st, i));
  const undo = () => {
    if (!past.length) return false;
    setSt(past[past.length - 1]); setPast((p) => p.slice(0, -1));
    return true;
  };
  const restart = () => { setSt(newGame(W, H, BUGS)); setPast([]); setSecs(0); };

  // Capture phase on window, so a handled Ctrl+Z never reaches the desktop's window-undo (same as Paint).
  const undoRef = useRef(undo); undoRef.current = undo;
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && undoRef.current()) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active]);

  const onKeyDown = (e, i) => {
    const x = i % W, y = (i / W) | 0;
    const go = { ArrowLeft: x > 0 ? i - 1 : i, ArrowRight: x < W - 1 ? i + 1 : i, ArrowUp: y > 0 ? i - W : i, ArrowDown: y < H - 1 ? i + W : i }[e.key];
    if (go !== undefined) { e.preventDefault(); setCursor(go); grid.current.children[go].focus(); }
    else if (e.key.toLowerCase() === 'f') { e.preventDefault(); act(i, true); }
  };

  const face = st.status === 'lost' ? 'Oops' : st.status === 'won' ? 'Shipped!' : 'New game';
  const label = (i) => {
    if (st.flag[i] && !(st.status === 'lost' && st.bugs[i])) return 'flagged';
    if (!st.open[i]) return 'hidden';
    if (st.bugs?.[i]) return 'bug';
    const n = count(st, i);
    return n ? `${n} bug${n > 1 ? 's' : ''} nearby` : 'empty';
  };

  return (
    <div className="game sweeper">
      <div className="sweep-hud sunken">
        <span className="lcd" aria-label={`${flagsLeft(st)} bugs left`}>{pad3(flagsLeft(st))}</span>
        <button type="button" className="btn sweep-face" onClick={restart} aria-label={`${face}. Start a new game.`}>
          <Icon name={st.status === 'lost' ? 'faceLost' : st.status === 'won' ? 'faceWon' : 'face'} size={24} />
        </button>
        <span className="lcd" aria-label={`${secs} seconds`}>{pad3(secs)}</span>
      </div>
      <div className="sweep-grid sunken" ref={grid} role="grid" aria-label={`Bug Sweeper, ${W} by ${H}`} style={{ '--cols': W }}
        onContextMenu={(e) => e.preventDefault()}>
        {st.open.map((open, i) => {
          const n = open && st.bugs && !st.bugs[i] ? count(st, i) : 0;
          const bug = open && st.bugs?.[i];
          return (
            <button key={i} type="button" role="gridcell" tabIndex={i === cursor ? 0 : -1}
              className={`cell${open ? ' is-open' : ''}${i === st.hit ? ' is-hit' : ''}${st.status === 'lost' && st.flag[i] && !st.bugs[i] ? ' is-wrong' : ''}`}
              data-n={n || undefined} aria-label={`Row ${((i / W) | 0) + 1}, column ${(i % W) + 1}: ${label(i)}`}
              onClick={() => { setCursor(i); act(i); }} onContextMenu={(e) => { e.preventDefault(); act(i, true); }}
              onKeyDown={(e) => onKeyDown(e, i)} onFocus={() => setCursor(i)}>
              {bug ? <Icon name="bughunt" size={20} /> : st.flag[i] && !open ? <Icon name="flag" size={16} /> : n || ''}
            </button>
          );
        })}
      </div>
      <div className="sweep-bar">
        <button type="button" className={`btn${flagMode ? ' is-pressed' : ''}`} aria-pressed={flagMode} onClick={() => setFlagMode(!flagMode)}>
          <Icon name="flag" size={14} /> Flag mode
        </button>
        <button type="button" className="btn" disabled={!past.length} onClick={undo}>Undo <kbd>Ctrl+Z</kbd></button>
      </div>
      <p className="sweep-msg" aria-live="polite">
        {st.status === 'lost' ? 'You hit a bug. Ctrl+Z takes the click back.'
          : st.status === 'won' ? `Bug-free in ${secs} seconds. Ship it.`
          : 'Right-click, F, or Flag mode marks a bug. Numbers count the bugs touching a cell.'}
      </p>
    </div>
  );
}
