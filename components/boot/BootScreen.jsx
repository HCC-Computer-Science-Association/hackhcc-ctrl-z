'use client';
import { useEffect } from 'react';

const BASE = process.env.NEXT_PUBLIC_BASE;

// The timing lives in CSS (globals.css, "Boot"), so the boot ends even if JS never loads.
// JS only adds: skip on click/keypress, and remembering the boot for this tab.
export default function BootScreen() {
  useEffect(() => {
    const root = document.documentElement;
    const remember = () => { try { sessionStorage.setItem('booted', '1'); } catch {} };
    // Skip: data-booted swaps in the post-boot entrance animations, so windows open right away.
    const skip = () => { root.dataset.booted = '1'; remember(); window.removeEventListener('keydown', skip); };
    if (root.dataset.booted) return;
    const phone = matchMedia('(max-width: 640px)').matches;
    // Natural end: CSS already hides the boot and plays the entrances. Setting data-booted here would
    // restart those entrances mid-zoom (windows opened twice), so only remember and stop listening.
    const t = setTimeout(() => { remember(); window.removeEventListener('keydown', skip); }, phone ? 1450 : 2900);
    window.addEventListener('keydown', skip);
    document.getElementById('boot-skip')?.addEventListener('click', skip);
    return () => { clearTimeout(t); window.removeEventListener('keydown', skip); };
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
