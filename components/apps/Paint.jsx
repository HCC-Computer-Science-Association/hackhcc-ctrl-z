'use client';
import { useEffect, useRef, useState } from 'react';
import { C } from '../desktop/icons';
import { W, H, blank, line, fill } from '../../lib/paint.mjs';
import { unlock } from '../../lib/achieve.mjs';

// Ctrl Z Paint: a 64x40 pixel canvas where Ctrl+Z undoes each stroke (Ctrl+Y or Ctrl+Shift+Z redoes).
// With nothing left to undo, Ctrl+Z falls through to the desktop and reopens a closed window.
const KEYS = Object.keys(C);
const NAMES = { k: 'Ink', w: 'White', c: 'Cream', n: 'Navy', b: 'Royal blue', l: 'Sky', y: 'Yellow', o: 'Gold', g: 'Grey', s: 'Silver', r: 'Red', G: 'Green' };
const RGB = KEYS.map((k) => [1, 3, 5].map((i) => parseInt(C[k].slice(i, i + 2), 16)));
const BG = KEYS.indexOf('w');
const TOOLS = [{ id: 'pencil', label: 'Pencil' }, { id: 'eraser', label: 'Eraser' }, { id: 'fill', label: 'Fill' }];
const HISTORY = 100;

export default function Paint({ active }) {
  const cv = useRef(null);
  const px = useRef(blank(BG));
  const undo = useRef([]);
  const redo = useRef([]);
  const last = useRef(null); // [x, y, colour] while a stroke is down
  const [tool, setTool] = useState('pencil');
  const [color, setColor] = useState(KEYS.indexOf('b'));
  const [at, setAt] = useState(null);
  const [, bump] = useState(0); // re-render so Undo/Redo buttons enable and disable

  const render = () => {
    const ctx = cv.current.getContext('2d');
    const img = ctx.createImageData(W, H);
    px.current.forEach((c, i) => { img.data.set(RGB[c], i * 4); img.data[i * 4 + 3] = 255; });
    ctx.putImageData(img, 0, 0);
  };
  useEffect(render, []);

  const snapshot = () => {
    undo.current.push(px.current.slice());
    if (undo.current.length > HISTORY) undo.current.shift();
    redo.current = [];
    bump((n) => n + 1);
  };
  const step = (from, to) => {
    if (!from.current.length) return false;
    to.current.push(px.current);
    px.current = from.current.pop();
    render(); bump((n) => n + 1);
    return true;
  };
  const doUndo = () => step(undo, redo);
  const doRedo = () => step(redo, undo);

  // Capture phase on window, so a handled Ctrl+Z never reaches the desktop's window-undo.
  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (!(e.ctrlKey || e.metaKey) || e.target.closest?.('input, textarea')) return;
      const k = e.key.toLowerCase();
      const done = k === 'z' && !e.shiftKey ? doUndo() : k === 'y' || (k === 'z' && e.shiftKey) ? doRedo() : false;
      if (done) { e.preventDefault(); e.stopPropagation(); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active]);

  const cell = (e) => {
    const r = cv.current.getBoundingClientRect();
    return [
      Math.max(0, Math.min(W - 1, Math.floor(((e.clientX - r.left) / r.width) * W))),
      Math.max(0, Math.min(H - 1, Math.floor(((e.clientY - r.top) / r.height) * H))),
    ];
  };
  const down = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = cell(e);
    snapshot();
    if (tool === 'fill') { fill(px.current, x, y, color); render(); return; }
    const c = tool === 'eraser' ? BG : color;
    line(px.current, x, y, x, y, c); render();
    last.current = [x, y, c];
  };
  const move = (e) => {
    const [x, y] = cell(e);
    setAt([x, y]);
    if (!last.current) return;
    const [lx, ly, c] = last.current;
    line(px.current, lx, ly, x, y, c); render();
    last.current = [x, y, c];
  };
  const up = () => { last.current = null; };

  const clear = () => { snapshot(); px.current.fill(BG); render(); };
  const save = () => {
    const big = document.createElement('canvas');
    big.width = W * 10; big.height = H * 10;
    const g = big.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(cv.current, 0, 0, big.width, big.height);
    big.toBlob((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b); a.download = 'ctrl-z-paint.png'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    unlock('artist');
  };

  return (
    <div className="paint">
      <div className="paint-tools" role="toolbar" aria-label="Paint tools">
        {TOOLS.map((t) => (
          <button key={t.id} type="button" className={`btn${tool === t.id ? ' is-pressed' : ''}`} aria-pressed={tool === t.id} onClick={() => setTool(t.id)}>{t.label}</button>
        ))}
        <span className="paint-gap" />
        <button type="button" className="btn" onClick={doUndo} disabled={!undo.current.length} title="Ctrl+Z">Undo</button>
        <button type="button" className="btn" onClick={doRedo} disabled={!redo.current.length} title="Ctrl+Y">Redo</button>
        <button type="button" className="btn" onClick={clear}>Clear</button>
        <button type="button" className="btn btn-primary" onClick={save}>Save PNG</button>
      </div>
      <div className="paint-colors" role="radiogroup" aria-label="Colour">
        {KEYS.map((k, i) => (
          <button key={k} type="button" role="radio" aria-checked={color === i} aria-label={NAMES[k]} title={NAMES[k]}
            className="paint-swatch" style={{ background: C[k] }}
            onClick={() => { setColor(i); if (tool === 'eraser') setTool('pencil'); }} />
        ))}
      </div>
      <div className="sunken paint-stage">
        <canvas ref={cv} width={W} height={H} role="img" aria-label="Drawing canvas"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={() => setAt(null)} />
      </div>
      <div className="paint-status">
        <span>{at ? `${at[0]}, ${at[1]}` : `${W} × ${H} px`}</span>
        <span>Ctrl+Z undoes a stroke · Ctrl+Y redoes</span>
      </div>
    </div>
  );
}
