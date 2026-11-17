// Served from the root of https://controlz.hackhcc.org (GitHub Pages custom
// domain), so there is no basePath. If the site ever moves back under a
// subpath, set BASE to it (e.g. '/hackhcc-ctrl-z'); components read it from
// NEXT_PUBLIC_BASE when building asset URLs.
const BASE = '';

export default {
  output: 'export',
  basePath: BASE,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE: BASE },
};
