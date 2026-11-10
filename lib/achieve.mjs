// Achievements: saved in localStorage, announced with a 'ctrlz-achieve' window event (the taskbar shows a balloon).
export const ACHIEVEMENTS = [
  { id: 'explorer', name: 'Explorer', how: 'Open every app on the desktop.' },
  { id: 'undo', name: 'Ctrl+Z', how: 'Bring back a window you closed.' },
  { id: 'pong', name: 'Paddle master', how: 'Beat the CPU at Ping Pong.' },
  { id: 'bughunt', name: 'Exterminator', how: 'Squash 20 bugs in one round of Bug Hunt.' },
  { id: 'solitaire', name: 'Card shark', how: 'Win a game of Solitaire.' },
  { id: 'hacker', name: 'I\'m in', how: 'Run "hack" in the Terminal.' },
  { id: 'rickrolled', name: 'You were warned', how: 'Click the thing you were told not to.' },
  { id: 'shutdown', name: 'Safe to turn off', how: 'Shut down Ctrl Z OS.' },
];

const read = (key) => { try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; } };
const write = (key, v) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

export const unlocked = () => read('ctrlz-achievements');

export function unlock(id) {
  const have = unlocked();
  if (have.includes(id)) return false;
  write('ctrlz-achievements', [...have, id]);
  window.dispatchEvent(new CustomEvent('ctrlz-achieve', { detail: ACHIEVEMENTS.find((a) => a.id === id) }));
  return true;
}

// Remember which apps were ever opened; all of them unlocks Explorer.
export function trackOpened(ids, total) {
  const seen = [...new Set([...read('ctrlz-opened'), ...ids])];
  write('ctrlz-opened', seen);
  if (seen.length >= total) unlock('explorer');
}
