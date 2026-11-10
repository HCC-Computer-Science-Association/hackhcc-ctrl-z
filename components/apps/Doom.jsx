'use client';
import { useEffect, useRef, useState } from 'react';

const SRC = `${process.env.NEXT_PUBLIC_BASE}/doom/index.html`;

// Freedoom (free levels, BSD) on the MBF engine (GPL-2.0), run by js-dos inside an iframe
// (public/doom/index.html) so its CSS stays out of the site. Nothing downloads until Play.
export default function Doom() {
  const [play, setPlay] = useState(false);
  const [touch, setTouch] = useState(false);
  const frame = useRef(null);

  useEffect(() => { setTouch(matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches); }, []);

  return (
    <div className="game doom">
      <div className="doom-screen sunken">
        {play
          ? <iframe className="doom-host" src={SRC} title="Freedoom game" allow="autoplay; fullscreen" ref={(el) => { frame.current = el; el?.focus(); }} />
          : (
            <div className="game-card doom-card">
              {touch ? (
                <>
                  <h3>Freedoom needs a keyboard.</h3>
                  <p>Open this window on a laptop or desktop to play.</p>
                </>
              ) : (
                <>
                  <h3>Freedoom</h3>
                  <p>A free first-person shooter on a classic DOS engine. About 11 MB downloads when you press Play.</p>
                  <button type="button" className="btn btn-primary" onClick={() => setPlay(true)}>Play</button>
                </>
              )}
            </div>
          )}
      </div>
      <div className="doom-bar">
        <p className="doom-keys">
          <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> move · <kbd>←</kbd><kbd>→</kbd> turn · <kbd>Ctrl</kbd> fire · <kbd>Space</kbd> open · <kbd>1</kbd>–<kbd>7</kbd> weapons · <kbd>Esc</kbd> menu
        </p>
        <button type="button" className="btn" disabled={!play} onClick={() => frame.current?.requestFullscreen?.().then(() => frame.current.focus()).catch(() => {})}>
          Fullscreen
        </button>
      </div>
      <p className="doom-hint">Want it bigger without fullscreen? Use the window's maximize button or double-click its title bar.</p>
      <p className="doom-legal">
        Levels: <a href="https://freedoom.github.io/" target="_blank" rel="noopener noreferrer">Freedoom</a> (BSD license).
        Engine: MBF 2.03 (GPL-2.0, <a href="https://www.doomworld.com/idgames/source/mbfsrc" target="_blank" rel="noopener noreferrer">source</a>).
        Emulator: <a href="https://js-dos.com/" target="_blank" rel="noopener noreferrer">js-dos</a>.
      </p>
    </div>
  );
}
