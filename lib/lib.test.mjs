import test from 'node:test';
import assert from 'node:assert/strict';
import { initState, reducer, focusedId } from './windows.mjs';
import { countdown, currentSlot } from './time.mjs';

test('open puts the window on top', () => {
  let s = initState(['about', 'faq']);
  assert.equal(focusedId(s), 'faq');
  s = reducer(s, { type: 'focus', id: 'about' });
  assert.equal(focusedId(s), 'about');
});

test('close then undo reopens the last closed window, in LIFO order', () => {
  let s = initState(['about', 'faq', 'schedule']);
  s = reducer(s, { type: 'close', id: 'faq' });
  s = reducer(s, { type: 'close', id: 'about' });
  assert.equal(s.wins.about.open, false);
  s = reducer(s, { type: 'undo' });
  assert.equal(s.wins.about.open, true);
  assert.equal(s.rewound, 'about');
  assert.equal(focusedId(s), 'about');
  s = reducer(s, { type: 'undo' });
  assert.equal(s.wins.faq.open, true);
  assert.equal(reducer(s, { type: 'undo' }), s, 'empty undo stack is a no-op');
});

test('minimize hides from focus; focus restores', () => {
  let s = initState(['about', 'faq']);
  s = reducer(s, { type: 'minimize', id: 'faq' });
  assert.equal(focusedId(s), 'about');
  s = reducer(s, { type: 'focus', id: 'faq' });
  assert.equal(s.wins.faq.min, false);
  assert.equal(focusedId(s), 'faq');
});

test('maximize toggles and brings the window to the front', () => {
  let s = initState(['about', 'doom']);
  s = reducer(s, { type: 'maximize', id: 'about' });
  assert.equal(s.wins.about.max, true);
  assert.equal(focusedId(s), 'about');
  s = reducer(s, { type: 'maximize', id: 'about' });
  assert.equal(s.wins.about.max, false);
  s = reducer(s, { type: 'resize', id: 'about', width: 700, height: 500 });
  assert.deepEqual([s.wins.about.width, s.wins.about.height], [700, 500]);
});

test('reopening a closed window removes it from the undo stack', () => {
  let s = initState(['about']);
  s = reducer(s, { type: 'close', id: 'about' });
  s = reducer(s, { type: 'open', id: 'about' });
  assert.deepEqual(s.closed, []);
});

test('countdown and current slot', () => {
  const start = '2027-03-01T10:00:00Z';
  const t = new Date(start).getTime();
  assert.deepEqual(countdown(start, t - (26 * 60 + 5) * 60000), { d: 1, h: 2, m: 5 });
  assert.equal(countdown(null), null);
  assert.equal(countdown(start, t + 1), null);
  const slots = [{ hour: 0 }, { hour: 2 }, { hour: 12 }];
  assert.equal(currentSlot(start, slots, t + 3 * 3600000), 1);
  assert.equal(currentSlot(start, slots, t - 1), -1);
  assert.equal(currentSlot(start, slots, t + 25 * 3600000), -1);
  assert.equal(currentSlot(null, slots), -1);
});

import { deal, draw, move, toFoundation, canStack, won, bestMove } from './klondike.mjs';

test('klondike deal: 7 piles with top card up, 24 in stock', () => {
  const st = deal(() => 0.5);
  assert.deepEqual(st.tab.map((p) => p.length), [1, 2, 3, 4, 5, 6, 7]);
  assert.ok(st.tab.every((p) => p[p.length - 1].up && p.slice(0, -1).every((c) => !c.up)));
  assert.equal(st.stock.length, 24);
});

test('klondike stacking and moves', () => {
  const c = (s, r, up = true) => ({ s, r, up });
  assert.ok(canStack(c(1, 6), [c(0, 7)]), 'red 6 on black 7');
  assert.ok(!canStack(c(2, 6), [c(1, 7)]), 'red on red is illegal');
  assert.ok(canStack(c(0, 13), []), 'king on empty');
  assert.ok(!canStack(c(0, 12), []), 'only kings on empty');

  const st = { stock: [], waste: [c(1, 1)], found: [[], [], [], []], tab: [[c(3, 9, false), c(0, 2)], [c(2, 3)]], moves: 0 };
  const a = toFoundation(st, { pile: 'waste' });
  assert.equal(a.found[0].length + a.found[1].length + a.found[2].length + a.found[3].length, 1, 'ace to foundation');
  const b = move(a, { pile: 'tab', i: 0 }, { pile: 'tab', i: 1 });
  assert.equal(b.tab[1].length, 2, 'black 2 onto red 3');
  assert.equal(b.tab[0][0].up, true, 'uncovered card flips up');
  assert.equal(move(b, { pile: 'tab', i: 1, idx: 0 }, { pile: 'tab', i: 0 }), null, 'red 3 cannot go on black 9');
});

test('klondike draw recycles the waste', () => {
  let st = { stock: [{ s: 0, r: 5, up: false }], waste: [], found: [[], [], [], []], tab: [], moves: 0 };
  st = draw(st);
  assert.equal(st.waste[0].up, true);
  st = draw(st);
  assert.equal(st.stock.length, 1);
  assert.equal(st.stock[0].up, false);
  assert.equal(won({ found: [0, 1, 2, 3].map((s) => Array.from({ length: 13 }, (_, r) => ({ s, r: r + 1 }))) }), true);
});

test('klondike one-click: foundation first, then a stack, else null', () => {
  const c = (s, r, up = true) => ({ s, r, up });
  const st = { stock: [], waste: [c(1, 1)], found: [[], [], [], []], tab: [[c(0, 7)], [c(1, 6)], []], moves: 0 };
  assert.equal(bestMove(st, { pile: 'waste' }).waste.length, 0, 'ace goes home');
  const b = bestMove(st, { pile: 'tab', i: 1 });
  assert.equal(b.tab[0].length, 2, 'red 6 onto black 7');
  assert.equal(bestMove(st, { pile: 'tab', i: 0 }), null, 'black 7 has nowhere to go');
});

test('achievements unlock once and Explorer needs every app', async () => {
  const mem = new Map();
  globalThis.localStorage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, String(v)) };
  globalThis.window = new EventTarget();
  const { unlock, unlocked, trackOpened } = await import('./achieve.mjs');
  const heard = [];
  window.addEventListener('ctrlz-achieve', (e) => heard.push(e.detail.id));
  assert.equal(unlock('pong'), true);
  assert.equal(unlock('pong'), false);
  trackOpened(['a', 'b'], 3);
  assert.ok(!unlocked().includes('explorer'));
  trackOpened(['b', 'c'], 3);
  assert.deepEqual(heard, ['pong', 'explorer']);
});

test('tab completion finds matches and their shared prefix', async () => {
  const { complete } = await import('./complete.mjs');
  const words = ['schedule', 'screensaver', 'solitaire', 'sudo'];
  assert.deepEqual(complete('sc', words), { matches: ['schedule', 'screensaver'], common: 'sc' });
  assert.deepEqual(complete('so', words), { matches: ['solitaire'], common: 'solitaire' });
  assert.deepEqual(complete('x', words), { matches: [], common: '' });
  assert.equal(complete('SCR', words).common, 'screensaver');
});

test('closest suggests a near command and nothing for gibberish', async () => {
  const { closest } = await import('./complete.mjs');
  assert.equal(closest('shedule', ['schedule', 'help']), 'schedule');
  assert.equal(closest('hlep', ['schedule', 'help']), 'help');
  assert.equal(closest('qqqqqq', ['schedule', 'help']), null);
});

test('paint: line has no gaps and fill stops at walls', async () => {
  const { W, H, blank, line, fill } = await import('./paint.mjs');
  const px = blank(0);
  line(px, 0, 0, 10, 3, 1);
  assert.equal(px[0], 1); assert.equal(px[3 * W + 10], 1);
  assert.equal([...px].filter((v) => v === 1).length, 11); // one pixel per column
  const box = blank(0);
  line(box, 5, 0, 5, H - 1, 2); // a wall down column 5
  fill(box, 0, 0, 3);
  assert.equal(box[W - 1], 0); // right of the wall untouched
  assert.equal([...box].filter((v) => v === 3).length, 5 * H);
});

test('logo ops paint the whole canvas, background first', async () => {
  const { W, H, logo } = await import('./paint.mjs');
  const ix = { n: 1, b: 2, w: 3, y: 4, k: 5, l: 6, G: 7, r: 8 };
  const { ops, bg } = logo(ix);
  assert.equal(bg, W * H);
  assert.ok(ops.slice(0, bg).every(([, c]) => c === ix.n));
  const px = new Uint8Array(W * H);
  for (const [i, c] of ops) px[i] = c;
  assert.equal(px[0], ix.b); // frame
  assert.equal(px[5 * W + 5], ix.w); // top-left of the H in HACK
  assert.equal(px[5 * W + 37], ix.y); // top-left of the H in HCC
  assert.ok(!px.includes(0)); // nothing left unpainted
});

test('sweeper: first click is safe and floods, flags block reveals, a bug loses', async () => {
  const { newGame, reveal, toggleFlag, neighbors, flagsLeft } = await import('./sweeper.mjs');
  let rnd = 1; const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647; // seeded
  let st = reveal(newGame(9, 9, 10), 40, rand);
  assert.equal(st.bugs.filter(Boolean).length, 10);
  assert.ok(!st.bugs[40] && neighbors(9, 9, 40).every((j) => !st.bugs[j]), 'first cell and neighbours are safe');
  assert.ok(st.open.filter(Boolean).length > 9, 'an empty first cell floods open');
  const bug = st.bugs.indexOf(true);
  st = toggleFlag(st, bug);
  assert.equal(flagsLeft(st), 9);
  assert.equal(reveal(st, bug, rand), st, 'a flagged cell does not open');
  st = reveal(toggleFlag(st, bug), bug, rand);
  assert.equal(st.status, 'lost'); assert.equal(st.hit, bug);
});

test('sweeper: opening every safe cell wins', async () => {
  const { newGame, reveal } = await import('./sweeper.mjs');
  let st = reveal(newGame(5, 5, 3), 12);
  for (let i = 0; i < 25; i++) if (!st.bugs[i]) st = reveal(st, i);
  assert.equal(st.status, 'won');
  assert.deepEqual(st.flag, st.bugs, 'a win flags every bug');
});

test('snake: moves, eats and grows, ignores reversing, wraps through walls, dies only on itself', async () => {
  const { newSnake, step, turn, DIRS } = await import('./snake.mjs');
  let s = { ...newSnake(10, 10), food: [7, 5] };
  s = step(s);
  assert.deepEqual(s.body[0], [7, 5]); assert.equal(s.body.length, 4); assert.equal(s.score, 1);
  assert.equal(turn(s, DIRS.left), s, 'no reversing');
  s = { ...s, food: [0, 0] };
  for (let i = 0; i < 2; i++) s = step(s); // x 8, then 9: the last column
  assert.ok(!s.over);
  s = step(s); // x 10 is off the 10-wide board: come back in at x 0
  assert.ok(!s.over, 'walls do not end the game');
  assert.deepEqual(s.body[0], [0, 5], 'wrapped to the opposite wall');
  let t = { ...newSnake(10, 10), body: [[5, 5], [5, 6], [4, 6], [4, 5], [4, 4]], dir: DIRS.up, food: [0, 0] };
  t = step(turn(t, DIRS.left));
  assert.ok(t.over, 'running into your own tail ends the game');
});

test('defrag: moves until files are contiguous, bad blocks stay put', async () => {
  const { makeDisk, nextMove, progress } = await import('./defrag.mjs');
  let rnd = 7; const rand = () => (rnd = (rnd * 16807) % 2147483647) / 2147483647;
  const disk = makeDisk(200, rand), bad = disk.map((b, i) => (b === 'bad' ? i : -1)).filter((i) => i >= 0);
  const used = disk.filter((b) => b === 'used').length;
  for (let m; (m = nextMove(disk)); ) { disk[m[0]] = 'done'; disk[m[1]] = 'free'; }
  const firstFree = disk.indexOf('free');
  assert.ok(disk.slice(firstFree).every((b) => b === 'free' || b === 'bad'), 'no file block after the first gap');
  assert.equal(disk.filter((b) => b === 'used' || b === 'done').length, used, 'no block lost');
  assert.deepEqual(disk.map((b, i) => (b === 'bad' ? i : -1)).filter((i) => i >= 0), bad);
  assert.equal(progress(disk), 1);
});
