'use client';
import { useEffect, useRef, useState } from 'react';

const W = 480, H = 300, PW = 8, PH = 54, BALL = 8, WIN = 5;
const COL = { bg: '#000067', line: '#1738bb', you: '#f5e7cd', cpu: '#8fb4ff', ball: '#ffe600' };

// Ping Pong: you are the left paddle (mouse, touch, W/S or arrow keys). First to 5.
export default function Pong({ active }) {
  const canvas = useRef(null);
  const [score, setScore] = useState([0, 0]);
  const [phase, setPhase] = useState('idle'); // idle | play | over
  const keys = useRef({});
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const ctx = canvas.current.getContext('2d');
    const s = { you: H / 2 - PH / 2, cpu: H / 2 - PH / 2, bx: W / 2, by: H / 2, vx: 0, vy: 0, pts: [0, 0] };
    const serve = (dir) => { s.bx = W / 2; s.by = H / 2; s.vx = 3.6 * dir; s.vy = (Math.random() * 2 - 1) * 2.4; };
    if (phase === 'play') serve(Math.random() < 0.5 ? -1 : 1);

    const draw = () => {
      ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = COL.line;
      for (let y = 4; y < H; y += 16) ctx.fillRect(W / 2 - 2, y, 4, 8);
      ctx.fillStyle = COL.you; ctx.fillRect(16, Math.round(s.you), PW, PH);
      ctx.fillStyle = COL.cpu; ctx.fillRect(W - 16 - PW, Math.round(s.cpu), PW, PH);
      if (phase === 'play') { ctx.fillStyle = COL.ball; ctx.fillRect(Math.round(s.bx), Math.round(s.by), BALL, BALL); }
    };

    const onMove = (e) => {
      const r = canvas.current.getBoundingClientRect();
      s.you = Math.max(0, Math.min(H - PH, ((e.clientY - r.top) / r.height) * H - PH / 2));
    };
    const onKey = (e) => {
      if (!activeRef.current) return;
      if (['ArrowUp', 'ArrowDown', 'w', 's', 'W', 'S'].includes(e.key)) { e.preventDefault(); keys.current[e.key.toLowerCase()] = e.type === 'keydown'; }
    };
    canvas.current.addEventListener('pointermove', onMove);
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);

    let raf;
    const tick = () => {
      if (phase === 'play') {
        const k = keys.current;
        if (k.arrowup || k.w) s.you = Math.max(0, s.you - 6);
        if (k.arrowdown || k.s) s.you = Math.min(H - PH, s.you + 6);
        // CPU follows the ball with a capped speed, so it can be beaten.
        const target = s.by - PH / 2 + BALL / 2;
        s.cpu += Math.max(-3.4, Math.min(3.4, target - s.cpu));
        s.cpu = Math.max(0, Math.min(H - PH, s.cpu));
        s.bx += s.vx; s.by += s.vy;
        if (s.by < 0 || s.by > H - BALL) { s.vy *= -1; s.by = Math.max(0, Math.min(H - BALL, s.by)); }
        const hit = (py, px, dir) => {
          if (s.by + BALL < py || s.by > py + PH) return false;
          if (dir < 0 ? s.bx > px + PW || s.bx < px - 4 : s.bx + BALL < px || s.bx + BALL > px + PW + 4) return false;
          const off = (s.by + BALL / 2 - (py + PH / 2)) / (PH / 2); // -1..1: where on the paddle it hit
          const sp = Math.min(Math.hypot(s.vx, s.vy) * 1.06, 9);
          s.vx = -dir * sp * Math.cos(off * 0.9); s.vy = sp * Math.sin(off * 0.9);
          return true;
        };
        if (s.vx < 0) hit(s.you, 16, -1); else hit(s.cpu, W - 16 - PW, 1);
        if (s.bx < -BALL || s.bx > W) {
          const who = s.bx < 0 ? 1 : 0;
          s.pts = s.pts.map((p, i) => (i === who ? p + 1 : p));
          setScore(s.pts);
          if (s.pts[who] >= WIN) setPhase('over'); else serve(who ? -1 : 1);
        }
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      canvas.current?.removeEventListener('pointermove', onMove);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keyup', onKey);
    };
  }, [phase]);

  const start = () => { setScore([0, 0]); setPhase('play'); };
  const won = score[0] > score[1];

  return (
    <div className="game pong">
      <div className="game-hud">
        <span>You <b>{score[0]}</b></span>
        <span>First to {WIN}</span>
        <span>CPU <b>{score[1]}</b></span>
      </div>
      <div className="sunken pong-field">
        <canvas ref={canvas} width={W} height={H} aria-label={`Ping Pong. You ${score[0]}, CPU ${score[1]}.`} />
        {phase !== 'play' && (
          <div className="game-card">
            <h3>{phase === 'over' ? (won ? 'You win.' : 'CPU wins. Ctrl+Z? Try again.') : 'Ping Pong'}</h3>
            <p>Move with the mouse, or W/S or the arrow keys.</p>
            <button type="button" className="btn btn-primary" onClick={start}>{phase === 'over' ? 'Rematch' : 'Serve'}</button>
          </div>
        )}
      </div>
    </div>
  );
}
