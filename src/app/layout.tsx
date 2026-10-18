import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'Mohamad Reza Nurpadilah — Fullstack Developer & QA',
  description:
    'Portfolio Mohamad Reza Nurpadilah, Junior Fullstack Developer & Manual QA dari Kuningan, Indonesia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} scroll-smooth`}>
      <body className="font-sans min-h-screen bg-paper text-ink antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
