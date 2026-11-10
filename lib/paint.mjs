// Pixel canvas for Ctrl Z Paint: a flat array of palette indexes, W x H. Ops mutate in place;
// the app copies the array before each stroke for undo.
export const W = 64, H = 40;

export const blank = (bg) => new Uint8Array(W * H).fill(bg);

export function dot(px, x, y, c) {
  if (x >= 0 && y >= 0 && x < W && y < H) px[y * W + x] = c;
}

// Bresenham line, so a fast mouse drag leaves no gaps.
export function line(px, x0, y0, x1, y1, c) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    dot(px, x0, y0, c);
    if (x0 === x1 && y0 === y1) return;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

// Flood fill (4-way) from x,y with colour c.
export function fill(px, x, y, c) {
  const from = px[y * W + x];
  if (from === c) return;
  const stack = [y * W + x];
  while (stack.length) {
    const i = stack.pop();
    if (px[i] !== from) continue;
    px[i] = c;
    const cx = i % W;
    if (cx > 0) stack.push(i - 1);
    if (cx < W - 1) stack.push(i + 1);
    if (i >= W) stack.push(i - W);
    if (i < W * (H - 1)) stack.push(i + W);
  }
}

// The HackHCC Ctrl Z badge as pixel-art paint ops, in the order a hand would paint it:
// a diagonal background sweep, then each element stroke by stroke. `ix` maps colour keys
// (n navy, b royal, w white, y yellow, k ink, l sky, G green, r red) to palette indexes.
// Returns { ops: [[index, colour]...], bg: number of background ops (painted faster) }.
const FONT = {
  H: ['101', '101', '111', '101', '101'], A: ['010', '101', '111', '101', '101'], C: ['011', '100', '100', '100', '011'],
  K: ['101', '101', '110', '101', '101'], T: ['111', '010', '010', '010', '010'], R: ['110', '101', '110', '101', '101'],
  L: ['100', '100', '100', '100', '111'], Z: ['111', '001', '010', '100', '111'],
};
export function logo(ix) {
  const ops = [];
  const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) ops.push([y * W + x, ix[c]]); };
  const rect = (x0, y0, w, h, c) => { for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) put(x, y, c); };
  const text = (str, x0, y0, c, s = 1) => [...str].forEach((ch, i) => {
    const g = FONT[ch], cx = x0 + i * 4 * s; // 3 px glyph + 1 px gap, scaled
    for (let col = 0; col < 3; col++) for (let row = 0; row < 5; row++) // column strokes, top to bottom
      if (g[row][col] === '1') rect(cx + col * s, y0 + row * s, s, s, c);
  });
  const cap = (x0, y0, w, label) => { // keycap: ink outline, white face, sky edge, ink label
    rect(x0 - 1, y0 - 1, w + 2, 13, 'k'); rect(x0, y0, w, 9, 'w'); rect(x0, y0 + 9, w, 2, 'l');
    text(label, x0 + 2, y0 + 2, 'k');
  };

  // Background: navy, swept diagonally from the top-left corner.
  const cells = [...Array(W * H).keys()].sort((a, b) => (a % W) + Math.floor(a / W) - ((b % W) + Math.floor(b / W)));
  for (const i of cells) ops.push([i, ix.n]);
  const bg = ops.length;

  for (let x = 0; x < W; x++) { put(x, 0, 'b'); put(x, H - 1, 'b'); } // royal frame
  for (let y = 0; y < H; y++) { put(0, y, 'b'); put(W - 1, y, 'b'); }
  text('HACK', 5, 5, 'w', 2);
  text('HCC', 37, 5, 'y', 2);
  cap(13, 19, 19, 'CTRL');
  rect(36, 23, 1, 1, 'y'); rect(35, 24, 3, 1, 'y'); rect(34, 25, 5, 1, 'y'); rect(35, 26, 3, 1, 'y'); rect(36, 27, 1, 1, 'y'); // plus
  cap(41, 19, 9, 'Z');
  rect(5, 33, 32, 5, 'k'); rect(6, 34, 22, 3, 'G'); // progress bar, mostly full
  for (const hx of [41, 47, 53]) ['rr.rr', 'rrrrr', '.rrr.', '..r..'].forEach((row, y) => [...row].forEach((c, x) => c === 'r' && put(hx + x, 34 + y, 'r')));
  return { ops, bg };
}
