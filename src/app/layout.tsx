import type { Metadata } from 'next';
import { Archivo, Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

// Display face for the public site: its width axis runs from 62 (condensed)
// to 125 (extended), so headlines can be set to fill a line exactly.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  style: ['normal', 'italic'],
  variable: '--font-archivo',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Mohamad Reza Nurpadilah — Fullstack Developer & QA',
  description:
    'Portfolio Mohamad Reza Nurpadilah, Junior Fullstack Developer & Manual QA dari Kuningan, Indonesia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} ${archivo.variable} ${geistMono.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen bg-paper text-ink antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
