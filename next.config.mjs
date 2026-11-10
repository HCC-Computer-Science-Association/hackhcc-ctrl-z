const isProd = process.env.NODE_ENV === 'production';

export default {
  output: 'export',
  basePath: isProd ? '/hackhcc-ctrl-z' : '',
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE: isProd ? '/hackhcc-ctrl-z' : '' },
};
