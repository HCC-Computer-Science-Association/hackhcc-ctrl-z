'use client';
import { useEffect, useRef, useState } from 'react';
import Icon from '../desktop/icons';

const ROUND = 30; // seconds
const BUGS = 6;
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
    const spawn = (b) => {
      b.x = Math.random() * (f.clientWidth - 32); b.y = Math.random() * (f.clientHeight - 32);
      const a = Math.random() * Math.PI * 2, sp = 1.2 + Math.random() * 1.6 + scoreRef.current * 0.05;
      b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp;
    };
    bugs.current = els.map((el) => { const b = { el }; spawn(b); return b; });
    let raf;
    const tick = () => {
      for (const b of bugs.current) {
        if (Math.random() < 0.02) { const a = Math.atan2(b.vy, b.vx) + (Math.random() - 0.5) * 1.6, sp = Math.hypot(b.vx, b.vy); b.vx = Math.cos(a) * sp; b.vy = Math.sin(a) * sp; }
        b.x += b.vx; b.y += b.vy;
        if (b.x < 0 || b.x > f.clientWidth - 32) b.vx *= -1;
        if (b.y < 0 || b.y > f.clientHeight - 32) b.vy *= -1;
        b.el.style.transform = `translate(${b.x}px, ${b.y}px) rotate(${Math.atan2(b.vy, b.vx) + Math.PI / 2}rad)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const clock = setInterval(() => setLeft((s) => s - 1), 1000);
    bugs.current.respawn = spawn;
    return () => { cancelAnimationFrame(raf); clearInterval(clock); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'play' && left <= 0) {
      setPhase('over');
      if (scoreRef.current > readBest()) { try { localStorage.setItem(KEY, scoreRef.current); } catch {} setBest(scoreRef.current); }
    }
  }, [left, phase]);

  const start = () => { scoreRef.current = 0; setScore(0); setLeft(ROUND); setPhase('play'); };

  const squash = (i, e) => {
    const b = bugs.current[i];
    const splat = document.createElement('span');
    splat.className = 'splat';
    splat.style.transform = `translate(${b.x}px, ${b.y}px)`;
    field.current.appendChild(splat);
    setTimeout(() => splat.remove(), 600);
    scoreRef.current += 1; setScore(scoreRef.current);
    bugs.current.respawn(b);
    e.currentTarget.blur();
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
