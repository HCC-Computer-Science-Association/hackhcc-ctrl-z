// Original 16x16 pixel icons, drawn as SVG rects (crisp at any scale).
const C = {
  k: '#0b0b1a', w: '#ffffff', c: '#f5e7cd', n: '#000067', b: '#1738bb', l: '#8fb4ff',
  y: '#ffe600', o: '#c9a400', g: '#7d7d86', s: '#c3c3cc', r: '#e0242f', G: '#4fbf3a',
};

const MAPS = {
  about: [
    '..kkkkkkkkkk....', '..kwwwwwwwwkk...', '..kwwwwwwwwkwk..', '..kwnnnnnwwkkkk.',
    '..kwwwwwwwwwwwk.', '..kwnnnnnnnnwwk.', '..kwwwwwwwwwwwk.', '..kwnnnnnnnwwwk.',
    '..kwwwwwwwwwwwk.', '..kwnnnnnnnnwwk.', '..kwwwwwwwwwwwk.', '..kwnnnnnwwwwwk.',
    '..kwwwwwwwwwwwk.', '..kwwwwwwwwwwwk.', '..kkkkkkkkkkkkk.',
  ],
  schedule: [
    '................', '.kkkkkkkkkkkkkk.', '.krrrrrrrrrrrrk.', '.krrkrrrrrrkrrk.',
    '.kkkkkkkkkkkkkk.', '.kwwwwwwwwwwwwk.', '.kwgwgwgwgwgwwk.', '.kwwwwwwwwwwwwk.',
    '.kwgwgwgwyyywwk.', '.kwwwwwwwyyywwk.', '.kwgwgwgwyyywwk.', '.kwwwwwwwwwwwwk.',
    '.kwgwgwgwgwwwwk.', '.kwwwwwwwwwwwwk.', '.kkkkkkkkkkkkkk.',
  ],
  faq: [
    '................', '...kkkkkkkkkkk..', '..kbbbbbbbbbbbk.', '..kbbbbyyyybbbk.',
    '..kbbbyybbyybbk.', '..kbbbbbbbyybbk.', '..kbbbbbbyybbbk.', '..kbbbbbyybbbbk.',
    '..kbbbbbyybbbbk.', '..kbbbbbbbbbbbk.', '..kbbbbbyybbbbk.', '..kbbbbbbbbbbbk.',
    '..kcccccccccccck.', '..kkkkkkkkkkkkk.',
  ],
  sponsors: [
    '................', '................', '.kkkkkk.........', '.kyyyyyk........',
    '.kyyyyyykkkkkkk.', '.kyyyyyyyyyyyyk.', '.kccccccccccccck', '.kyyyyyyyyyyyyok',
    '.kyyyyyyyyyyyyok', '.kyyyyyyyyyyyyok', '.kyyyyyyyyyyyyok', '.kyyyyyyyyyyyyok',
    '.koooooooooooook', '.kkkkkkkkkkkkkkk',
  ],
  undo: [
    '................', '.....kkkkkk.....', '..kkkkkkkkkkkk..', '..kssssssssssk..',
    '...kwsssssssk...', '...kwsbbbsssk...', '...kwbbsssbsk...', '...kbbbbssbsk...',
    '...kwbbsssbsk...', '...kwsbssbbsk...', '...kwssbbbssk...', '...kwsssssssk...',
    '...kwsssssssk...', '....kkkkkkkk....',
  ],
  register: [
    '................', '..kkkkkkkkkkkk..', '.kwwwwwwwwwwwwk.', '.kwwkkkkkkkwwlk.',
    '.kwwwwwwwkkwwlk.', '.kwwwwwwkkwwwlk.', '.kwwwwwkkwwwwlk.', '.kwwwwkkwwwwwlk.',
    '.kwwwkkwwwwwwlk.', '.kwwkkkkkkkwwlk.', '.kwwwwwwwwwwwlk.', '.kbbbbbbbbbbbbk.',
    '.kbbbbbbbbbbbbk.', '..kkkkkkkkkkkk..',
  ],
  terminal: [
    'kkkkkkkkkkkkkkkk', 'kbbbbbbbbbbbwbwk', 'kkkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk',
    'kkGkkkkkkkkkkkkk', 'kkkGkkkkkkkkkkkk', 'kkkkGkkkkkkkkkkk', 'kkkGkkkkkkkkkkkk',
    'kkGkkGGGGkkkkkkk', 'kkkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk', 'kssssssssssssssk',
    'kkkkkkkkkkkkkkkk',
  ],
  bughunt: [
    '......k..k......', '.......kk.......', '.....kkGGkk.....', '..k.kGGGGGGk.k..',
    '...kGGkGGkGGk...', '....kGGGGGGk....', '.kkkGGGGGGGGkkk.', '....kGGkkGGk....',
    '...kGGGGGGGGk...', '.kkkGGGkkGGGkkk.', '....kGGGGGGk....', '...k.kGGGGk.k...',
    '.......kk.......',
  ],
  pong: [
    'kkkkkkkkkkkkkkkk', 'knnnnnnnnnnnnnnk', 'kncnnnnnnnnnnnnk', 'kncnnnnnnnnnnnnk',
    'kncnnnnnwnnnnnnk', 'kncnnnnnnnnnnnnk', 'knnnnnnnwnnnnnnk', 'knnnnyynnnnnncnk',
    'knnnnyynwnnnncnk', 'knnnnnnnnnnnncnk', 'knnnnnnnwnnnncnk', 'knnnnnnnnnnnnnnk',
    'kkkkkkkkkkkkkkkk',
  ],
  solitaire: [
    '.......kkkkkkkk.', '.......kbbbbbbk.', '.......kbybybbk.', '..kkkkkkkbybybk.',
    '..kwwwwwwkbbbbk.', '..kwrwwwwkybybk.', '..kwwwwwwkbbbbk.', '..kwwrwrwkbybyk.',
    '..kwwrrrwkbbbbk.', '..kwwwrwwkkkkkk.', '..kwwwwwwk......', '..kwwwwrwk......',
    '..kkkkkkkk......',
  ],
  doom: [
    'kkkkkkkkkkkkkkkk', 'kkkkkkkkkkkkkkkk', 'kkkkkkkrkkkkkkkk', 'kkkkkkrrkkkkkkkk',
    'kkkkkrrykrkkkkkk', 'kkkkrryykrrkkkkk', 'kkkrryyyyrrkkkkk', 'kkkrryywyyrkkkkk',
    'kkkrryywwyrrkkkk', 'kkkkrryyyyrkkkkk', 'kkkkkrrrrrkkkkkk', 'kkkkkkkkkkkkkkkk',
    'kssssssssssssssk', '....kkkkkkkk....',
  ],
  heart: ['.rr.rr.', 'rrrrrrr', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'],
  spade: ['...k...', '..kkk..', '.kkkkk.', 'kkkkkkk', 'kkkkkkk', '.k.k.k.', '...k...', '..kkk..'],
  diamond: ['...r...', '..rrr..', '.rrrrr.', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'],
  club: ['..kkk..', '..kkk..', 'kk.k.kk', 'kkkkkkk', 'kk.k.kk', '...k...', '..kkk..'],
  heartEmpty: ['.kk.kk.', 'k..k..k', 'k.....k', '.k...k.', '..k.k..', '...k...'],
};

export default function Icon({ name, size = 32, className }) {
  const rows = MAPS[name];
  const w = Math.max(...rows.map((r) => r.length));
  const rects = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const fill = C[row[x]];
      if (fill) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />);
    }
  });
  return (
    <svg className={className} viewBox={`0 0 ${w} ${rows.length}`} width={size} height={(size * rows.length) / w}
      shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {rects}
    </svg>
  );
}
