import { Jersey_15, VT323, Atkinson_Hyperlegible } from 'next/font/google';
import './globals.css';

const pixel = Jersey_15({ subsets: ['latin'], weight: '400', variable: '--f-pixel', display: 'swap' });
const bios = VT323({ subsets: ['latin'], weight: '400', variable: '--f-bios', display: 'swap' });
const prose = Atkinson_Hyperlegible({ subsets: ['latin'], weight: ['400', '700'], variable: '--f-prose', display: 'swap' });

export const metadata = {
  title: 'HackHCC Ctrl Z — 24-hour hackathon at Houston City College',
  description: 'A 24-hour student hackathon at Houston City College, open to students from any school. Date and venue TBA.',
};

export const viewport = { themeColor: '#000067' };

// Runs before paint: skip the boot on repeat visits in this tab, or for reduced motion.
const bootCheck = `try{if(sessionStorage.getItem('booted')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.booted='1'}catch(e){}`;

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
