'use client';
import { useEffect, useRef } from 'react';

// Two keycaps, Ctrl and Z, bounce around the screen. Any input ends it.
export default function Screensaver({ onExit }) {
  const ref = useRef(null);

  useEffect(() => {
    const stage = ref.current;
    const caps = [...stage.querySelectorAll('.ss-cap')];
    const W = () => stage.clientWidth, H = () => stage.clientHeight;
    const b = caps.map((el, i) => ({
      el, x: W() * (0.2 + i * 0.4), y: H() * (0.3 + i * 0.2),
      vx: (i ? -1 : 1) * 2.4, vy: (i ? 1 : -1) * 1.9, hue: i * 140,
    }));
    let raf;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches; // show the caps, don't move them
    const tick = () => {
      for (const c of b) {
        const w = c.el.offsetWidth, h = c.el.offsetHeight;
        c.x += c.vx; c.y += c.vy;
        if (c.x < 0 || c.x + w > W()) { c.vx *= -1; c.x = Math.max(0, Math.min(c.x, W() - w)); c.hue += 67; }
        if (c.y < 0 || c.y + h > H()) { c.vy *= -1; c.y = Math.max(0, Math.min(c.y, H() - h)); c.hue += 67; }
        c.el.style.transform = `translate(${c.x}px, ${c.y}px)`;
        c.el.style.setProperty('--hue', c.hue);
      }
      if (!still) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const stop = () => onExit();
    const t = setTimeout(() => {
      window.addEventListener('pointermove', stop, { once: true });
      window.addEventListener('pointerdown', stop, { once: true });
      window.addEventListener('keydown', stop, { once: true });
    }, 300); // ignore the input that may have started it
    return () => {
      cancelAnimationFrame(raf); clearTimeout(t);
      window.removeEventListener('pointermove', stop);
      window.removeEventListener('pointerdown', stop);
      window.removeEventListener('keydown', stop);
    };
  }, [onExit]);

  return (
    <div className="screensaver" ref={ref} role="presentation">
      <span className="ss-cap">Ctrl</span>
      <span className="ss-cap ss-z">Z</span>
      <p className="sr-only">Screensaver running. Press any key to return.</p>
    </div>
  );
}
