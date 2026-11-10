// Snake rules on a w x h grid. Pure: step() returns a new state. Walls wrap you to the opposite side; only your own tail ends the game.
// state = { w, h, body: [[x, y], ...] head first, dir: [dx, dy], next: queued turns, food: [x, y], score, over }

export const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };

export function newSnake(w = 24, h = 16, rand = Math.random) {
  const y = h >> 1;
  const st = { w, h, body: [[6, y], [5, y], [4, y]], dir: DIRS.right, next: [], food: null, score: 0, over: false };
  return { ...st, food: placeFood(st, rand) };
}

// A random free cell for the food.
export function placeFood(st, rand = Math.random) {
  const taken = new Set(st.body.map(([x, y]) => y * st.w + x));
  const free = [...Array(st.w * st.h).keys()].filter((i) => !taken.has(i));
  const i = free[Math.floor(rand() * free.length)];
  return i === undefined ? null : [i % st.w, (i / st.w) | 0];
}

// Queue a turn (up to 2, so quick double-taps both count). Reversing into yourself is ignored.
export function turn(st, d) {
  const last = st.next[st.next.length - 1] || st.dir;
  if (st.next.length >= 2 || (d[0] === -last[0] && d[1] === -last[1]) || (d[0] === last[0] && d[1] === last[1])) return st;
  return { ...st, next: [...st.next, d] };
}

export function step(st, rand = Math.random) {
  if (st.over) return st;
  const [dir, ...next] = st.next.length ? st.next : [st.dir];
  const head = [(st.body[0][0] + dir[0] + st.w) % st.w, (st.body[0][1] + dir[1] + st.h) % st.h]; // off one edge, in at the other
  const eats = st.food && head[0] === st.food[0] && head[1] === st.food[1];
  const body = [head, ...(eats ? st.body : st.body.slice(0, -1))];
  const bite = body.slice(1).some(([x, y]) => x === head[0] && y === head[1]);
  if (bite) return { ...st, dir, next: [], over: true };
  const s = { ...st, body, dir, next, score: st.score + (eats ? 1 : 0) };
  return eats ? { ...s, food: placeFood(s, rand) } : s;
}
