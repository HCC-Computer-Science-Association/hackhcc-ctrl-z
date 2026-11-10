// Tiny square-wave blips made with Web Audio: no audio files. On by default; the taskbar speaker mutes it (saved).
const KEY = 'ctrlz-sound';
const NOTES = { // [frequency Hz, seconds], played in sequence
  click: [[880, 0.03]],
  open: [[523, 0.05], [784, 0.08]],
  close: [[392, 0.05], [262, 0.09]],
  undo: [[784, 0.05], [523, 0.05], [659, 0.09]],
  chime: [[523, 0.11], [659, 0.11], [784, 0.11], [1047, 0.3]],
  achieve: [[659, 0.07], [784, 0.07], [1047, 0.2]],
};
let ctx;

export const soundOn = () => { try { return localStorage.getItem(KEY) !== '0'; } catch { return true; } };

export function setSound(on) {
  try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {}
  play('chime');
}

export function play(kind) {
  if (!NOTES[kind] || !soundOn()) return;
  try {
    ctx ||= new AudioContext();
    let t = ctx.currentTime;
    for (const [f, d] of NOTES[kind]) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square'; o.frequency.value = f;
      g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + d);
      t += d;
    }
  } catch {} // no Web Audio: stay silent
}
