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

import { deal, draw, move, toFoundation, canStack, won } from './klondike.mjs';

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
