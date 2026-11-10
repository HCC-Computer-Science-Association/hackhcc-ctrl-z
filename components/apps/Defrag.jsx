'use client';
import { useEffect, useRef, useState } from 'react';
import { makeDisk, nextMove, progress } from '../../lib/defrag.mjs';

const COLS = 40, ROWS = 12, CELL = 12; // canvas pixels per block, scaled up crisp by CSS
const STEP_MS = 45; // one read or write per tick: ~12 s for a fresh disk
const COL = { free: '#000067', used: '#8fb4ff', done: '#f5e7cd', bad: '#e0242f', read: '#ffe600', write: '#4fbf3a', grid: '#1738bb' };
const LINES = [
  'Defragmenting your sleep schedule...',
  'Moving 24 hours of caffeine closer together...',
  'Consolidating side projects...',
  'Reading TODO.txt (this may take a while)...',
  'Undoing fragmentation. Ctrl+Z, but for disks...',
  'Packing snacks into contiguous blocks...',
];
const LEGEND = [['done', 'Optimized'], ['used', 'Not optimized'], ['free', 'Free space'], ['read', 'Reading'], ['write', 'Writing'], ['bad', 'Bad (do not touch)']];

// A DOS-style disk defragmenter. Purely for show: it reorganizes a pretend disk, block by block.
export default function Defrag() {
  const cv = useRef(null);
  const disk = useRef(makeDisk(COLS * ROWS));
  const [run, setRun] = useState(false);
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);
  const [line, setLine] = useState(0);

  const draw = (hi = {}) => {
    const ctx = cv.current.getContext('2d');
    ctx.fillStyle = COL.grid; ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    disk.current.forEach((b, i) => {
      ctx.fillStyle = COL[hi[i] || b];
      ctx.fillRect((i % COLS) * CELL + 1, ((i / COLS) | 0) * CELL + 1, CELL - 2, CELL - 2);
    });
  };

  // Start on open, unless the visitor prefers less motion (then it waits for the Start button).
  useEffect(() => { draw(); setPct(progress(disk.current)); if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setRun(true); }, []);

  useEffect(() => {
    if (!run) return;
    let phase = 0, move = null; // phase 0: read the block, 1: write it into the gap
    const t = setInterval(() => {
      const d = disk.current;
      if (!move) move = nextMove(d);
      if (!move) { draw(); setPct(1); setRun(false); setDone(true); return; }
      const [to, from] = move;
      if (phase === 0) { draw({ [from]: 'read' }); phase = 1; return; }
      d[to] = 'done'; d[from] = 'free';
      draw({ [to]: 'write' }); setPct(progress(d));
      phase = 0; move = null;
    }, STEP_MS);
    const words = setInterval(() => setLine((n) => (n + 1) % LINES.length), 2600);
    return () => { clearInterval(t); clearInterval(words); };
  }, [run]);

  const again = () => { disk.current = makeDisk(COLS * ROWS); draw(); setPct(progress(disk.current)); setDone(false); setRun(true); };

  return (
    <div className="defrag">
      <p className="defrag-title">Optimizing drive C: &nbsp;HACKHCC</p>
      <canvas ref={cv} className="defrag-disk" width={COLS * CELL} height={ROWS * CELL} role="img"
        aria-label={`Pretend disk map, ${Math.round(pct * 100)} percent optimized`} />
      <div className="defrag-status">
        <div>
          <p aria-live="polite">{done ? 'Defragmentation complete. Your weekend is now contiguous.' : run ? LINES[line] : 'Paused.'}</p>
          <div className="defrag-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)} aria-label="Progress">
            <span style={{ width: `${pct * 100}%` }} />
          </div>
          <p>{Math.round(pct * 100)}% complete</p>
        </div>
        <div className="defrag-actions">
          {done
            ? <button type="button" className="btn" onClick={again}>Fragment it again</button>
            : <button type="button" className="btn" onClick={() => setRun(!run)}>{run ? 'Pause' : 'Start'}</button>}
        </div>
      </div>
      <ul className="defrag-legend">
        {LEGEND.map(([k, label]) => <li key={k}><span style={{ background: COL[k] }} aria-hidden="true" />{label}</li>)}
      </ul>
    </div>
  );
}
