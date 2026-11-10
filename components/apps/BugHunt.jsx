'use client';
import { unlock } from '../../lib/achieve.mjs';
import { useEffect, useRef, useState } from 'react';
import Icon from '../desktop/icons';

const ROUND = 30; // seconds
const BUGS = 5;
const SIZE = 44; // hit box in px; the sprite is 32px inside it
const KEY = 'ctrlz-bughunt-best';

const readBest = () => { try { return +localStorage.getItem(KEY) || 0; } catch { return 0; } };

export default function BugHunt() {
  const [phase, setPhase] = useState('idle'); // idle | play | over
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(ROUND);
  const [best, setBest] = useState(0);
  const field = useRef(null);
  const bugs = useRef([]);
  const scoreRef = useRef(0);

  useEffect(() => setBest(readBest()), []);

  // Movement: positions live in refs and go straight to the DOM; React only renders the score.
  useEffect(() => {
    if (phase !== 'play') return;
    const f = field.current;
    const els = [...f.querySelectorAll('.bug')];
    // Speeds are px per second, so the game plays the same on 60 Hz and 144 Hz screens.
    const spawn = (b) => {
      b.x = Math.random() * (f.clientWidth - SIZE); b.y = Math.random() * (f.clientHeight - SIZE);
      const a = Math.random() * Math.PI * 2, sp = 55 + Math.random() * 35 + Math.min(scoreRef.current, 20) * 3;
      b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp; b.rest = 0;
    };
    bugs.current = els.map((el) => { const b = { el }; spawn(b); return b; });
    let raf, last = performance.now();
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      for (const b of bugs.current) {
        // Bugs wander, and now and then stop for a moment: that is your chance.
        if (b.rest > 0) { b.rest -= dt; b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${Math.atan2(b.vy, b.vx) + Math.PI / 2}rad)`; continue; }
        if (Math.random() < dt * 0.5) b.rest = 0.5 + Math.random() * 0.7;
        if (Math.random() < dt * 1.2) { const a = Math.atan2(b.vy, b.vx) + (Math.random() - 0.5) * 1.6, sp = Math.hypot(b.vx, b.vy); b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp; }
        b.x += b.vx * dt; b.y += b.vy * dt;
        if (b.x < 0 || b.x > f.clientWidth - SIZE) { b.vx *= -1; b.x = Math.max(0, Math.min(b.x, f.clientWidth - SIZE)); }
        if (b.y < 0 || b.y > f.clientHeight - SIZE) { b.vy *= -1; b.y = Math.max(0, Math.min(b.y, f.clientHeight - SIZE)); }
        b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${Math.atan2(b.vy, b.vx) + Math.PI / 2}rad)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame((t) => { last = t; tick(t); });
    const clock = setInterval(() => setLeft((s) => s - 1), 1000);
    bugs.current.respawn = spawn;
    return () => { cancelAnimationFrame(raf); clearInterval(clock); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'play' && left <= 0) {
      setPhase('over');
      if (scoreRef.current >= 20) unlock('bughunt');
      if (scoreRef.current > readBest()) { try { localStorage.setItem(KEY, scoreRef.current); } catch {} setBest(scoreRef.current); }
    }
  }, [left, phase]);

  const start = () => { scoreRef.current = 0; setScore(0); setLeft(ROUND); setPhase('play'); };

  const squash = (i, e) => {
    const b = bugs.current[i];
    e.preventDefault();
    const splat = document.createElement('span');
    splat.className = 'splat';
    splat.style.transform = `translate(${b.x}px, ${b.y}px)`;
    field.current.appendChild(splat);
    setTimeout(() => splat.remove(), 600);
    scoreRef.current += 1; setScore(scoreRef.current);
    bugs.current.respawn(b);
  };

  return (
    <div className="game bughunt">
      <div className="game-hud">
        <span>Score <b>{score}</b></span>
        <span>Time <b>{phase === 'play' ? left : ROUND}s</b></span>
        <span>Best <b>{best}</b></span>
      </div>
      <div className="sunken bug-field" ref={field}>
        {phase === 'play' && Array.from({ length: BUGS }, (_, i) => (
          <button key={i} type="button" className="bug" aria-label="Squash bug" onPointerDown={(e) => squash(i, e)}>
            <Icon name="bughunt" size={32} />
          </button>
        ))}
        {phase !== 'play' && (
          <div className="game-card">
            <h3>{phase === 'over' ? `Time! You squashed ${score} bug${score === 1 ? '' : 's'}.` : 'Squash the bugs before the demo.'}</h3>
            <p>{phase === 'over' && score >= best && score > 0 ? 'New best score.' : `Click bugs to squash them. You have ${ROUND} seconds.`}</p>
            <button type="button" className="btn btn-primary" onClick={start}>{phase === 'over' ? 'Play again' : 'Start'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
