import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display, Fira_Code } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/components/providers/SessionProvider';

const sansFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
});

const serifFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
});

const monoFont = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Reza - Portfolio & Developer',
  description: 'Junior Fullstack Developer & Manual QA Portfolio',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${sansFont.variable} ${serifFont.variable} ${monoFont.variable} scroll-smooth`}
    >
      <body className="font-sans min-h-screen bg-slate-50/50 text-slate-900 antialiased selection:bg-red-100 selection:text-red-600">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
