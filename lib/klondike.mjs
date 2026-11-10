// Klondike solitaire rules, draw-one. Pure: every move returns a new state or null if illegal.
// card = { s: suit 0-3 (0 spades, 1 hearts, 2 diamonds, 3 clubs), r: rank 1-13, up: face up? }

export const red = (c) => c.s === 1 || c.s === 2;

export function deal(rand = Math.random) {
  const deck = [];
  for (let s = 0; s < 4; s++) for (let r = 1; r <= 13; r++) deck.push({ s, r, up: false });
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; }
  const tab = [];
  for (let i = 0; i < 7; i++) {
    const pile = deck.splice(0, i + 1);
    pile[i] = { ...pile[i], up: true };
    tab.push(pile);
  }
  return { stock: deck, waste: [], found: [[], [], [], []], tab, moves: 0 };
}

export function canStack(card, pile) {
  const top = pile[pile.length - 1];
  if (!top) return card.r === 13;
  return top.up && red(top) !== red(card) && top.r === card.r + 1;
}

export function canFound(card, pile) {
  const top = pile[pile.length - 1];
  return top ? top.s === card.s && top.r + 1 === card.r : card.r === 1;
}

export function draw(st) {
  if (!st.stock.length) {
    if (!st.waste.length) return st;
    return { ...st, stock: st.waste.map((c) => ({ ...c, up: false })).reverse(), waste: [], moves: st.moves + 1 };
  }
  const card = { ...st.stock[st.stock.length - 1], up: true };
  return { ...st, stock: st.stock.slice(0, -1), waste: [...st.waste, card], moves: st.moves + 1 };
}

// The cards a source picks up. from = { pile: 'waste' | 'found' | 'tab', i, idx }
export function picked(st, from) {
  if (from.pile === 'waste') return st.waste.slice(-1);
  if (from.pile === 'found') return st.found[from.i].slice(-1);
  const pile = st.tab[from.i];
  const idx = from.idx ?? pile.length - 1;
  return pile[idx]?.up ? pile.slice(idx) : [];
}

// to = { pile: 'tab' | 'found', i }
export function move(st, from, to) {
  const cards = picked(st, from);
  if (!cards.length) return null;
  if (to.pile === from.pile && to.i === from.i) return null;
  if (to.pile === 'found' && (cards.length !== 1 || !canFound(cards[0], st.found[to.i]))) return null;
  if (to.pile === 'tab' && !canStack(cards[0], st.tab[to.i])) return null;

  const next = { ...st, waste: st.waste, found: [...st.found], tab: [...st.tab], moves: st.moves + 1 };
  if (from.pile === 'waste') next.waste = st.waste.slice(0, -1);
  else if (from.pile === 'found') next.found[from.i] = st.found[from.i].slice(0, -1);
  else {
    const rest = st.tab[from.i].slice(0, st.tab[from.i].length - cards.length);
    if (rest.length && !rest[rest.length - 1].up) rest[rest.length - 1] = { ...rest[rest.length - 1], up: true };
    next.tab[from.i] = rest;
  }
  if (to.pile === 'found') next.found[to.i] = [...next.found[to.i], ...cards];
  else next.tab[to.i] = [...next.tab[to.i], ...cards];
  return next;
}

// Send one card to whichever foundation takes it.
export function toFoundation(st, from) {
  for (let i = 0; i < 4; i++) {
    const n = move(st, from, { pile: 'found', i });
    if (n) return n;
  }
  return null;
}

// One-click play: the best legal move for a source, or null.
// Foundation first (single top card), then a tableau pile that has cards, then an empty pile (kings only).
export function bestMove(st, from) {
  const cards = picked(st, from);
  if (!cards.length) return null;
  const isTop = from.pile !== 'tab' || (from.idx ?? st.tab[from.i].length - 1) === st.tab[from.i].length - 1;
  if (isTop && from.pile !== 'found') { const f = toFoundation(st, from); if (f) return f; }
  const order = st.tab.map((p, i) => i).filter((i) => !(from.pile === 'tab' && from.i === i))
    .sort((a, b) => (st.tab[a].length ? 0 : 1) - (st.tab[b].length ? 0 : 1));
  for (const i of order) {
    // Moving a king from a pile it already heads to an empty pile is pointless.
    if (!st.tab[i].length && from.pile === 'tab' && (from.idx ?? st.tab[from.i].length - 1) === 0) continue;
    const n = move(st, from, { pile: 'tab', i });
    if (n) return n;
  }
  return null;
}

export const won = (st) => st.found.every((p) => p.length === 13);
