// Bug Sweeper rules. Pure: every action returns a new state. Cells are indexes 0..w*h-1.
// state = { w, h, n, bugs: bool[] | null (planted on the first reveal), open: bool[], flag: bool[], status, hit }
// status: 'ready' | 'play' | 'won' | 'lost'

export function newGame(w = 9, h = 9, n = 10) {
  return { w, h, n, bugs: null, open: Array(w * h).fill(false), flag: Array(w * h).fill(false), status: 'ready', hit: -1 };
}

export function neighbors(w, h, i) {
  const x = i % w, y = (i / w) | 0, out = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
    const nx = x + dx, ny = y + dy;
    if ((dx || dy) && nx >= 0 && ny >= 0 && nx < w && ny < h) out.push(ny * w + nx);
  }
  return out;
}

export const count = (st, i) => neighbors(st.w, st.h, i).filter((j) => st.bugs[j]).length;

// Bugs go anywhere except the first cell and its neighbours, so the first click always opens an area.
function plant(st, safe, rand) {
  const keep = new Set([safe, ...neighbors(st.w, st.h, safe)]);
  const spots = [...Array(st.w * st.h).keys()].filter((i) => !keep.has(i));
  for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
  const bugs = Array(st.w * st.h).fill(false);
  spots.slice(0, st.n).forEach((i) => { bugs[i] = true; });
  return { ...st, bugs, status: 'play' };
}

export function reveal(st, i, rand = Math.random) {
  if (st.status === 'won' || st.status === 'lost' || st.flag[i]) return st;
  if (!st.bugs) st = plant(st, i, rand);
  // Clicking an open number whose flags are all placed opens the rest of its neighbours ("chord").
  if (st.open[i]) {
    const around = neighbors(st.w, st.h, i);
    if (around.filter((j) => st.flag[j]).length !== count(st, i)) return st;
    return around.reduce((s, j) => (s.open[j] || s.flag[j] ? s : reveal(s, j, rand)), st);
  }
  if (st.bugs[i]) return { ...st, open: st.open.map((o, j) => o || (st.bugs[j] && !st.flag[j])), status: 'lost', hit: i };
  const open = [...st.open], todo = [i];
  while (todo.length) { // flood: an empty cell opens all its neighbours
    const c = todo.pop();
    if (open[c] || st.flag[c]) continue;
    open[c] = true;
    if (!count(st, c)) todo.push(...neighbors(st.w, st.h, c));
  }
  const won = open.filter(Boolean).length === st.w * st.h - st.n;
  return { ...st, open, status: won ? 'won' : st.status, flag: won ? st.bugs.slice() : st.flag };
}

export function toggleFlag(st, i) {
  if (st.status === 'won' || st.status === 'lost' || st.open[i]) return st;
  const flag = [...st.flag]; flag[i] = !flag[i];
  return { ...st, flag };
}

export const flagsLeft = (st) => st.n - st.flag.filter(Boolean).length;
