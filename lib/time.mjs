// Time helpers for the countdown and the live schedule row.

// Whole days/hours/minutes until `start`, or null when the date is TBA or past.
export function countdown(start, now = Date.now()) {
  if (!start) return null;
  const ms = new Date(start).getTime() - now;
  if (!(ms > 0)) return null;
  const m = Math.floor(ms / 60000);
  return { d: Math.floor(m / 1440), h: Math.floor((m % 1440) / 60), m: m % 60 };
}

// Index of the schedule slot running now. Slots are { hour } offsets from start; -1 if none.
export function currentSlot(start, slots, now = Date.now()) {
  if (!start) return -1;
  const hours = (now - new Date(start).getTime()) / 3600000;
  if (hours < 0 || hours >= 24) return -1;
  let idx = -1;
  slots.forEach((s, i) => { if (s.hour <= hours) idx = i; });
  return idx;
}
