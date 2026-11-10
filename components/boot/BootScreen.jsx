'use client';
import { useEffect } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE;

// The timing lives in CSS (globals.css, "Boot"), so the boot ends even if JS never loads.
// JS only adds: skip on click/keypress, and remembering the boot for this tab.
export default function BootScreen() {
  useEffect(() => {
    const root = document.documentElement;
    const done = () => {
      root.dataset.booted = '1';
      try { sessionStorage.setItem('booted', '1'); } catch {}
      window.removeEventListener('keydown', done);
    };
    if (root.dataset.booted) return;
    const t = setTimeout(done, 2900); // matches the CSS boot-out
    window.addEventListener('keydown', done);
    document.getElementById('boot-skip')?.addEventListener('click', done);
    return () => { clearTimeout(t); window.removeEventListener('keydown', done); };
  }, []);

  return (
    <div className="boot" role="presentation">
      <div className="boot-bios" aria-hidden="true">
        <p>CTRL-Z BIOS v1.0 &nbsp;(C) HackHCC</p>
        <p>Memory test ........... 640K OK</p>
        <p>Rewinding system clock  <span className="boot-year" /></p>
        <p>Detecting hackers ..... found</p>
        <p>Loading Ctrl Z OS_</p>
      </div>
      <div className="boot-splash" aria-hidden="true">
        <img src={`${BASE}/badge.png`} alt="" width="1161" height="238" />
        <div className="boot-bar"><span /></div>
      </div>
      <button id="boot-skip" className="boot-skip" type="button">Skip intro</button>
    </div>
  );
}
