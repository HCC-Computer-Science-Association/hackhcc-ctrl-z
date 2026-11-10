// Original 16x16 pixel icons, drawn as SVG rects (crisp at any scale).
export const C = {
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
  team: [
    '................', '..kkkk....kkkk..', '.knnnnk..knnnnk.', '.kcccck..kcccck.', '.kcccck..kcccck.',
    '..kkkk....kkkk..', '.kkkkkk..kkkkkk.', 'kbbbbbbkkyyyyyyk', 'kbbbbbbkkyyyyyyk', 'kbbllbbkkyyooyyk',
    'kbbbbbbkkyyyyyyk', 'kkkkkkkkkkkkkkkk', '................', '................',
  ],
  link: [ // a web page with the 90s shortcut arrow in the corner
    '................', '.kkkkkkkkkkkkkk.', '.knnnnnnnnnnnnk.', '.kwwwwwwwwwwwwk.', '.kwbbbbbbwwwwwk.',
    '.kwwwwwwwwwwwwk.', '.kwggggggggggwk.', 'kkkkkkkwwwwwwwk.', 'kwwwwwkgggggwwk.', 'kwwkkkkwwwwwwwk.',
    'kwwwkkkgggwwwwk.', 'kwwkwkkwwwwwwwk.', 'kwkwwwkkkkkkkkk.', 'kkkkkkk.........',
  ],
  sweeper: [
    '................', '.wwwwwwwwwwwwwg.', '.wssssssssssssg.', '.wsssrrrksssssg.', '.wssrrrrksssssg.',
    '.wsssrrrksssssg.', '.wssssssksssssg.', '.wssssssksssssg.', '.wsssskkkkssssg.', '.wsskkkkkkkkssg.',
    '.wssssssssssssg.', '.wggggggggggggg.', '................', '................',
  ],
  ideas: [
    '......kkkk......', '.....kyyyyk.....', '....kyywyyyk....', '....kywyyyyk....', '....kyyyyyyk....',
    '....kyyyyyyk....', '.....kyyyyk.....', '......kyyk......', '......kssk......', '......kggk......',
    '......kssk......', '.......kk.......', '................', '................',
  ],
  defrag: [
    '................', '.kkkkkkkkkkkkkk.', '.knnnnnnnnnnnnk.', '.kncclllccnrrnk.', '.kncclllccnrrnk.',
    '.knnnnnnnnnnnnk.', '.knllnccnGGllnk.', '.knllnccnGGllnk.', '.knnnnnnnnnnnnk.', '.knccnnnnnnccnk.',
    '.knccnnnnnnccnk.', '.knnnnnnnnnnnnk.', '.kkkkkkkkkkkkkk.', '................',
  ],
  snake: [
    '................', '.kkkkkkkkkkkkkk.', '.knnnnnnnnnnnnk.', '.knyyyyyynnnnnk.', '.knnnnnnynnrnnk.',
    '.knnnnnnynnnnnk.', '.knnyyyyynnnnnk.', '.knnynnnnnnnnnk.', '.knnyyyyyyyynnk.', '.knnnnnnnnnnnnk.',
    '.knnnnnnnnnnnnk.', '.knnnnnnnnnnnnk.', '.kkkkkkkkkkkkkk.', '................',
  ],
  face: ['...kkkkkk...', '..kyyyyyyk..', '.kyyyyyyyyk.', 'kyykyyyykyyk', 'kyykyyyykyyk', 'kyyyyyyyyyyk', 'kyyyyyyyyyyk', 'kykyyyyyykyk', 'kyykkkkkkyyk', '.kyyyyyyyyk.', '..kyyyyyyk..', '...kkkkkk...'],
  faceLost: ['...kkkkkk...', '..kyyyyyyk..', '.kyyyyyyyyk.', 'kykykyykykyk', 'kyykyyyykyyk', 'kykykyykykyk', 'kyyyyyyyyyyk', 'kyyykkkkyyyk', 'kyykyyyykyyk', '.kyyyyyyyyk.', '..kyyyyyyk..', '...kkkkkk...'],
  faceWon: ['...kkkkkk...', '..kyyyyyyk..', '.kyyyyyyyyk.', 'kykkkkkkkkyk', 'kyykkyykkyyk', 'kyyyyyyyyyyk', 'kyyyyyyyyyyk', 'kykyyyyyykyk', 'kyykkkkkkyyk', '.kyyyyyyyyk.', '..kyyyyyyk..', '...kkkkkk...'],
  flag: ['.rrrrk...', 'rrrrrk...', '.rrrrk...', '.....k...', '.....k...', '...kkkkk.', '..kkkkkkk'],
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
  challenge: [
    '................', '..kkkkkkkkkkkk..', 'kkkyyyyyyyyyykkk', 'kyykyyyyyyyykyyk', 'kyykyyywyyyykyyk',
    '.kykyyywyyyykyk.', '..kkyyyyyyyykk..', '...kyyyyyyyyk...', '....kyyyyyyk....', '.....kkyykk.....',
    '......kook......', '.....kooook.....', '....kkkkkkkk....', '....kbbbbbbk....', '....kkkkkkkk....',
  ],
  dontclick: [
    '................', '.....kkkkkk.....', '...kkrrrrrrkk...', '..krrwwrrrrrrk..', '.krrwrrrrrrrrrk.',
    '.krrrrrrrrrrrrk.', '.krrrrrrrrrrrrk.', '..krrrrrrrrrrk..', '...kkrrrrrrkk...', '..kgkkkkkkkkgk..',
    '.kssssssssssssk.', '.kggggggggggggk.', '..kkkkkkkkkkkk..',
  ],
  spade: ['...k...', '..kkk..', '.kkkkk.', 'kkkkkkk', 'kkkkkkk', '.k.k.k.', '...k...', '..kkk..'],
  diamond: ['...r...', '..rrr..', '.rrrrr.', 'rrrrrrr', '.rrrrr.', '..rrr..', '...r...'],
  club: ['..kkk..', '..kkk..', 'kk.k.kk', 'kkkkkkk', 'kk.k.kk', '...k...', '..kkk..'],
  display: [
    '................', '.kkkkkkkkkkkkkk.', '.kssssssssssssk.', '.kskkkkkkkkkksk.', '.kskbbbbbbbbksk.',
    '.kskbyybbbbbksk.', '.kskbbbbbbbbksk.', '.kskbbbbllbbksk.', '.kskbbbllllbksk.', '.kskkkkkkkkkksk.',
    '.kssssssssssGsk.', '.kkkkkkkkkkkkkk.', '......kssk......', '....kkkkkkkk....',
  ],
  paint: [
    '................', '....kkkkkkk.....', '..kkcccccccck...', '.kcrrcccyyccck..', '.kcrrcccyycccck.',
    'kccccccccccccck.', 'kcbbcccckkcccck.', 'kcbbccck..kccck.', 'kccccccckkccck..', 'kcGGcccccccck...',
    '.kGGcccccck.....', '..kkcccck.......', '....kkkk........', '................',
  ],
  power: [
    '................', '.......rr.......', '....r..rr..r....', '...rr..rr..rr...', '..rr...rr...rr..',
    '..r....rr....r..', '.rr....rr....rr.', '.rr..........rr.', '.rr..........rr.', '..r..........r..',
    '..rr........rr..', '...rr......rr...', '....rrrrrrrr....', '................',
  ],
  speaker: ['...k.....', '..kk..k..', 'kkwk...k.', 'kwwk.k.k.', 'kwwk.k.k.', 'kkwk...k.', '..kk..k..', '...k.....'],
  mute: ['...k.....', '..kk.....', 'kkwk.r.r.', 'kwwk..r..', 'kwwk.r.r.', 'kkwk.....', '..kk.....', '...k.....'],
  heartEmpty: ['.kk.kk.', 'k..k..k', 'k.....k', '.k...k.', '..k.k..', '...k...'],
};

// Each icon is drawn as one <path> per colour, with every horizontal run of same-colour pixels merged into one
// rectangle. Same pixels as one <rect> per pixel, at a fraction of the markup and DOM nodes. Cached per icon.
const PATHS = {};
function paths(name) {
  if (PATHS[name]) return PATHS[name];
  const rows = MAPS[name], d = {};
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const ch = row[x];
      let end = x + 1;
      while (row[end] === ch) end++;
      if (C[ch]) d[ch] = `${d[ch] || ''}M${x} ${y}h${end - x}v1H${x}z`;
      x = end;
    }
  });
  return (PATHS[name] = { w: Math.max(...rows.map((r) => r.length)), h: rows.length, d: Object.entries(d) });
}

export default function Icon({ name, size = 32, className }) {
  const { w, h, d } = paths(name);
  return (
    <svg className={className} viewBox={`0 0 ${w} ${h}`} width={size} height={(size * h) / w}
      shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      {d.map(([ch, path]) => <path key={ch} fill={C[ch]} d={path} />)}
    </svg>
  );
}
