'use client';
import { useEffect } from 'react';
import { unlock } from '../../lib/achieve.mjs';

// You were warned. Embeds the official music video, autoplaying; closing the window stops it.
const VIDEO = 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0';

export default function DontClick() {
  useEffect(() => { unlock('rickrolled'); }, []);
  return (
    <div className="dontclick">
      <div className="dontclick-video sunken">
        <iframe src={VIDEO} title="You were warned" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
      </div>
      <p className="dontclick-note">You were warned. Close the window to make it stop, or press Ctrl+Z to do it all again.</p>
    </div>
  );
}
