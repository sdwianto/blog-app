// src/app/layout.tsx

import clsx from 'clsx';
import { Inter } from 'next/font/google';

import './globals.css';
import { QueryProvider } from '@/components/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={clsx(inter.variable, 'font-sans')}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
