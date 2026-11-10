'use client';
import { useEffect, useRef, useState } from 'react';
import { unlock } from '../../lib/achieve.mjs';
import { newSnake, step, turn, DIRS } from '../../lib/snake.mjs';

const GW = 24, GH = 16, CELL = 20;
const COL = { bg: '#000067', wall: '#1738bb', snake: '#ffe600', head: '#f5e7cd', food: '#e0242f' };
const KEYS = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' };
const BEST = 'ctrlz-snake-best';
const HEART = ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...']; // the badge's pixel heart
const speed = (score) => Math.max(65, 140 - score * 4); // ms per move: a little faster with every heart

// SNAKE.BAS: eat the hearts and don't bite yourself. Walls wrap you to the other side. Arrows or WASD; swipe on a phone; Space pauses.
export default function Snake({ active }) {
  const cv = useRef(null);
  const game = useRef(newSnake(GW, GH));
  const [phase, setPhase] = useState('idle'); // idle | play | pause | over
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const activeRef = useRef(active); activeRef.current = active;

  useEffect(() => { try { setBest(+localStorage.getItem(BEST) || 0); } catch {} draw(); }, []);

  const draw = () => {
    const ctx = cv.current.getContext('2d'), g = game.current;
    ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, GW * CELL, GH * CELL);
    if (g.food) {
      ctx.fillStyle = COL.food;
      HEART.forEach((row, y) => [...row].forEach((c, x) => c === 'r' && ctx.fillRect(g.food[0] * CELL + 3 + x * 2, g.food[1] * CELL + 4 + y * 2, 2, 2)));
    }
    g.body.forEach(([x, y], i) => { ctx.fillStyle = i ? COL.snake : COL.head; ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2); });
  };

  useEffect(() => {
    if (phase !== 'play') return;
    let t;
    const tick = () => {
      const before = game.current.score;
      game.current = step(game.current);
      draw();
      const g = game.current;
      if (g.score !== before) { setScore(g.score); if (g.score >= 15) unlock('snake'); }
      if (g.over) {
        setPhase('over');
        try { if (g.score > (+localStorage.getItem(BEST) || 0)) { localStorage.setItem(BEST, g.score); setBest(g.score); } } catch {}
        return;
      }
      t = setTimeout(tick, speed(g.score));
    };
    t = setTimeout(tick, speed(game.current.score));
    return () => clearTimeout(t);
  }, [phase]);

  const start = () => { game.current = newSnake(GW, GH); setScore(0); draw(); setPhase('play'); };
  const steer = (d) => { game.current = turn(game.current, DIRS[d]); };

  useEffect(() => {
    const onKey = (e) => {
      if (!activeRef.current || e.ctrlKey || e.metaKey || e.altKey) return;
      const d = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (d && phase === 'play') { e.preventDefault(); steer(d); }
      else if (e.key === ' ' && (phase === 'play' || phase === 'pause')) { e.preventDefault(); setPhase(phase === 'play' ? 'pause' : 'play'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase]);

  // Hidden tab: pause, so the snake doesn't keep moving (and using CPU) where nobody can see it.
  useEffect(() => {
    if (phase !== 'play') return;
    const onHide = () => { if (document.hidden) setPhase('pause'); };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [phase]);

  // Swipe: the longer axis of the drag picks the direction.
  const touch = useRef(null);
  const onPointerDown = (e) => { touch.current = [e.clientX, e.clientY]; };
  const onPointerUp = (e) => {
    if (!touch.current || phase !== 'play') return;
    const dx = e.clientX - touch.current[0], dy = e.clientY - touch.current[1];
    touch.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
  };

  return (
    <div className="game snake">
      <div className="snake-hud">
        <span>SCORE: {score}</span>
        <span>SNAKE.BAS</span>
        <span>HIGH: {best}</span>
      </div>
      <div className="sunken snake-field" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <canvas ref={cv} width={GW * CELL} height={GH * CELL} aria-label={`Snake. Score ${score}.`} />
        {phase !== 'play' && (
          <div className="game-card snake-card">
            <h3>{phase === 'over' ? `Game over. Score ${score}.` : phase === 'pause' ? 'Paused' : 'Snake'}</h3>
            <p>{phase === 'pause' ? 'Press Space to keep going.' : 'Eat the hearts and don\'t bite your own tail. Walls wrap you to the other side. Arrows or WASD; swipe on a phone.'}</p>
            {phase === 'pause'
              ? <button type="button" className="btn btn-primary" onClick={() => setPhase('play')}>Resume</button>
              : <button type="button" className="btn btn-primary" onClick={start}>{phase === 'over' ? 'Play again' : 'Start'}</button>}
          </div>
        )}
      </div>
    </div>
  );
}
