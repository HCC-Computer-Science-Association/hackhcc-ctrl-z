// Window manager state. Pure, so it is testable with `node --test`.
// state = { wins: { [id]: { open, min, z, x, y } }, top, closed: [id...], rewound }

export function initState(openIds = []) {
  const s = { wins: {}, top: 0, closed: [], rewound: null };
  return openIds.reduce((st, id) => reducer(st, { type: 'open', id }), s);
}

export function reducer(s, a) {
  const w = s.wins[a.id] || { open: false, min: false, z: 0, x: null, y: null };
  const put = (patch, extra = {}) => ({ ...s, ...extra, wins: { ...s.wins, [a.id]: { ...w, ...patch } } });

  switch (a.type) {
    case 'open':
      return put({ open: true, min: false, z: s.top + 1 }, { top: s.top + 1, closed: s.closed.filter((id) => id !== a.id), rewound: null });
    case 'focus':
      if (!w.open || (w.z === s.top && !w.min)) return s;
      return put({ z: s.top + 1, min: false }, { top: s.top + 1 });
    case 'minimize':
      return put({ min: true });
    case 'maximize': // toggle
      return put({ max: !w.max, z: s.top + 1, min: false }, { top: s.top + 1 });
    case 'close':
      if (!w.open) return s;
      return put({ open: false, min: false }, { closed: [...s.closed.filter((id) => id !== a.id), a.id], rewound: null });
    case 'move':
      return put({ x: a.x, y: a.y });
    case 'resize':
      return put({ width: a.width, height: a.height });
    case 'undo': {
      const id = s.closed[s.closed.length - 1];
      if (!id) return s;
      const next = reducer({ ...s, closed: s.closed.slice(0, -1) }, { type: 'open', id });
      return { ...next, rewound: id };
    }
    case 'restore': // from sessionStorage
      return a.state && a.state.wins ? { ...a.state, rewound: null } : s;
    default:
      return s;
  }
}

// The open, non-minimized window with the highest z.
export function focusedId(s) {
  let best = null;
  for (const [id, w] of Object.entries(s.wins)) if (w.open && !w.min && (!best || w.z > s.wins[best].z)) best = id;
  return best;
}
