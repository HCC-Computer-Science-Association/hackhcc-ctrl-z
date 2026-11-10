'use client';
import { useEffect, useRef, useState } from 'react';
import { unlock } from '../../lib/achieve.mjs';

const W = 480, H = 300, PW = 8, PH = 54, BALL = 8, WIN = 5;
const SERVE = 2.5, MAX = 5.6, SPEEDUP = 1.035, CPU = 2.4; // px per frame. CPU < ball speed after a few hits, so rallies are winnable.
const PAUSE = 500; // ms between a point and the next serve
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
    const s = { you: H / 2 - PH / 2, cpu: H / 2 - PH / 2, bx: W / 2, by: H / 2, vx: 0, vy: 0, pts: [0, 0], waitUntil: 0, msg: '' };
    // A full reset: paddles back to the middle, speed back to SERVE, and the ball waits on the
    // serving paddle's face (dir 1 = you serve toward the CPU, -1 = the CPU serves toward you).
    const serve = (dir, delay = 0) => {
      s.bx = dir > 0 ? 16 + PW : W - 16 - PW - BALL; s.by = H / 2 - BALL / 2; s.vx = SERVE * dir; s.vy = (Math.random() * 2 - 1) * 1.8;
      s.you = s.cpu = H / 2 - PH / 2;
      s.waitUntil = performance.now() + delay;
    };
    if (phase === 'play') serve(Math.random() < 0.5 ? -1 : 1, PAUSE);

    const draw = () => {
      ctx.fillStyle = COL.bg; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = COL.line;
      for (let y = 4; y < H; y += 16) ctx.fillRect(W / 2 - 2, y, 4, 8);
      ctx.fillStyle = COL.you; ctx.fillRect(16, Math.round(s.you), PW, PH);
      ctx.fillStyle = COL.cpu; ctx.fillRect(W - 16 - PW, Math.round(s.cpu), PW, PH);
      if (phase === 'play') { ctx.fillStyle = COL.ball; ctx.fillRect(Math.round(s.bx), Math.round(s.by), BALL, BALL); } // visible on the server's paddle during the pause
      if (phase === 'play' && performance.now() < s.waitUntil && s.msg) {
        ctx.fillStyle = COL.ball; ctx.font = '28px "Jersey 15", sans-serif'; ctx.textAlign = 'center'; ctx.fillText(s.msg, W / 2, H / 2 + 10);
      }
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
      if (phase === 'play' && performance.now() >= s.waitUntil) {
        const k = keys.current;
        if (k.arrowup || k.w) s.you = Math.max(0, s.you - 6);
        if (k.arrowdown || k.s) s.you = Math.min(H - PH, s.you + 6);
        // CPU follows the ball with a capped speed, so it can be beaten.
        const target = s.by - PH / 2 + BALL / 2;
        s.cpu += Math.max(-CPU, Math.min(CPU, target - s.cpu));
        s.cpu = Math.max(0, Math.min(H - PH, s.cpu));
        const px0 = s.bx;
        s.bx += s.vx; s.by += s.vy;
        if (s.by < 0 || s.by > H - BALL) { s.vy *= -1; s.by = Math.max(0, Math.min(H - BALL, s.by)); }
        // A paddle returns the ball only as the ball crosses the paddle's front face this frame,
        // so a ball that already got past can't bounce back from behind the paddle.
        const hit = (py, face, dir) => {
          const crossed = dir < 0 ? px0 >= face && s.bx <= face : px0 + BALL <= face && s.bx + BALL >= face;
          if (!crossed || s.by + BALL < py || s.by > py + PH) return;
          s.bx = dir < 0 ? face : face - BALL;
          const off = (s.by + BALL / 2 - (py + PH / 2)) / (PH / 2); // -1..1: where on the paddle it hit
          const sp = Math.min(Math.hypot(s.vx, s.vy) * SPEEDUP, MAX);
          s.vx = -dir * sp * Math.cos(off * 0.9); s.vy = sp * Math.sin(off * 0.9);
        };
        if (s.vx < 0) hit(s.you, 16 + PW, -1); else hit(s.cpu, W - 16 - PW, 1);
        if (s.bx < -BALL || s.bx > W) {
          const who = s.bx < 0 ? 1 : 0;
          s.pts = s.pts.map((p, i) => (i === who ? p + 1 : p));
          setScore(s.pts);
          s.msg = who ? 'Point: CPU' : 'Point: you';
          if (s.pts[who] >= WIN) { setPhase('over'); if (!who) unlock('pong'); } else serve(who ? -1 : 1, PAUSE);
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
