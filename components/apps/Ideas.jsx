'use client';
import { useEffect, useRef, useState } from 'react';
import { Menu } from './About';

const KEY = 'ctrlz-ideas';
const TEMPLATE = `Project name:
The problem:
Who it's for:
What we'll build in 24 hours:
Stack:
Stretch goal (if the clock is kind):
`;

// A plain-text scratchpad for hackathon ideas. Saved in this browser as you type; Ctrl+Z undoes typing (the
// browser's own text undo, so the desktop's window-undo stays out of the way); Ctrl+S downloads a .txt.
export default function Ideas() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(true);
  const area = useRef(null);

  useEffect(() => { try { setText(localStorage.getItem(KEY) || ''); } catch {} area.current?.focus(); }, []);
  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => { try { localStorage.setItem(KEY, text); setSaved(true); } catch {} }, 300);
    return () => clearTimeout(t);
  }, [text]);

  // Edits go through execCommand so they land in the textarea's own undo history (Ctrl+Z can take them back).
  const insert = (s) => { area.current.focus(); if (!document.execCommand('insertText', false, s)) setText((t) => t + s); };
  const download = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = 'IDEAS.TXT'; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const clear = () => { area.current.focus(); area.current.select(); if (!document.execCommand('delete')) setText(''); };
  const undo = () => { area.current.focus(); document.execCommand('undo'); };

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="ideas">
      <nav className="menubar" aria-label="Ideas.txt menu">
        <Menu label="File" items={[{ label: 'Save as IDEAS.TXT', key: 'Ctrl+S', run: download }, { label: 'Clear page', run: clear, disabled: !text }]} />
        <Menu label="Edit" items={[{ label: 'Undo typing', key: 'Ctrl+Z', run: undo }, { label: 'Insert idea template', run: () => insert(TEMPLATE) }]} />
      </nav>
      <label className="sr-only" htmlFor="ideas-text">Your hackathon ideas</label>
      <textarea id="ideas-text" ref={area} className="ideas-text" value={text} spellCheck="true"
        placeholder={'Jot down ideas for the hackathon.\nEdit > Insert idea template gives you a starting outline.'}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); download(); } }} />
      <div className="statusbar">
        <span aria-live="polite">{saved ? 'Saved in this browser' : 'Saving…'}</span>
        <span>{words} word{words === 1 ? '' : 's'}</span>
      </div>
    </div>
  );
}
