// Defrag disk model. Blocks: 'used' (fragmented file), 'free', 'bad' (never moves), 'done' (already in place).
// Each move takes the last used block and puts it in the first free gap, until the files are contiguous.

export function makeDisk(n = 480, rand = Math.random) {
  return Array.from({ length: n }, () => { const r = rand(); return r < 0.02 ? 'bad' : r < 0.55 ? 'used' : 'free'; });
}

// [to, from] for the next move, or null when every used block sits before every free one.
export function nextMove(disk) {
  const to = disk.indexOf('free');
  const from = disk.lastIndexOf('used');
  return to !== -1 && from > to ? [to, from] : null;
}

// Blocks already in their final place (before the first free gap) count as done; used for the % shown.
export function progress(disk) {
  const used = disk.filter((b) => b === 'used' || b === 'done').length;
  const gap = disk.indexOf('free');
  const placed = disk.slice(0, gap === -1 ? disk.length : gap).filter((b) => b !== 'bad').length;
  return used ? Math.min(1, placed / used) : 1;
}
