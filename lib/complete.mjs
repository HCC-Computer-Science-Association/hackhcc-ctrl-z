// Tab completion: the words that start with `prefix`, and the longest prefix they all share.
export function complete(prefix, words) {
  const p = prefix.toLowerCase();
  const matches = words.filter((w) => w.startsWith(p)).sort();
  let common = matches[0] || '';
  for (const m of matches) while (!m.startsWith(common)) common = common.slice(0, -1);
  return { matches, common };
}

// For "did you mean": the word with the smallest edit distance, if it is close enough (at most 2 edits).
export function closest(word, words) {
  const d = (a, b) => {
    let row = [...Array(b.length + 1).keys()];
    for (let i = 1; i <= a.length; i++) {
      const next = [i];
      for (let j = 1; j <= b.length; j++) next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      row = next;
    }
    return row[b.length];
  };
  let best = null, bestD = 3;
  for (const w of words) { const x = d(word.toLowerCase(), w); if (x < bestD) { best = w; bestD = x; } }
  return best;
}
