import { Jersey_15, VT323, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const pixel = Jersey_15({ subsets: ['latin'], weight: '400', variable: '--f-pixel', display: 'swap' });
const bios = VT323({ subsets: ['latin'], weight: '400', variable: '--f-bios', display: 'swap' });
const prose = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--f-prose', display: 'swap' });

const SITE = 'https://hcc-computer-science-association.github.io/hackhcc-ctrl-z';
const description = 'A 24-hour student hackathon at Houston City College, open to students from any school. Date and venue TBA.';

// The preview image comes from app/opengraph-image.png (and twitter-image.png) by Next's file convention.
export const metadata = {
  metadataBase: new URL('https://hcc-computer-science-association.github.io'), // domain only: Next adds the basePath itself
  title: 'HackHCC Ctrl Z — 24-hour hackathon at Houston City College',
  description,
  openGraph: { title: 'HackHCC Ctrl Z', description, url: `${SITE}/`, siteName: 'HackHCC Ctrl Z', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'HackHCC Ctrl Z', description },
};

export const viewport = { themeColor: '#000067' };

// Runs before paint: skip the boot on repeat visits in this tab, or for reduced motion; apply the saved wallpaper and CRT setting.
const bootCheck = `try{if(sessionStorage.getItem('booted')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.booted='1'}catch(e){}try{var w=localStorage.getItem('ctrlz-wall');if(w)document.documentElement.dataset.wall=w;if(localStorage.getItem('ctrlz-crt')==='off')document.documentElement.dataset.crt='off'}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pixel.variable} ${bios.variable} ${prose.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootCheck }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
