import type { Metadata } from 'next';
import { Caveat, Geist, Permanent_Marker, Space_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

// Hand-made voice for the hero desk and the Work section: marker headlines,
// handwritten notes and a typewriter-style mono for labels.
const marker = Permanent_Marker({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-permanent-marker',
});

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata: Metadata = {
  title: 'Mohamad Reza Nurpadilah — Fullstack Developer & QA',
  description:
    'Portfolio Mohamad Reza Nurpadilah, Junior Fullstack Developer & Manual QA dari Kuningan, Indonesia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geist.variable} ${marker.variable} ${caveat.variable} ${spaceMono.variable} scroll-smooth`}
    >
      <body className="font-sans min-h-screen bg-paper text-ink antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
