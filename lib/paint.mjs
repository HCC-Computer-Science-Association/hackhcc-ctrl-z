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
