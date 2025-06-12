// src/app/layout.tsx
import clsx from 'clsx';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import { QueryProvider } from '@/components/QueryProvider';
import { SessionProviderWrapper } from '@/components/SessionProvider';

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
        <SessionProviderWrapper>
          <QueryProvider>{children}</QueryProvider>
        </SessionProviderWrapper>

        <Toaster
          position='top-center'
          toastOptions={{
            style: {
              padding: '12px 16px',
              borderRadius: '10px',
              background: '#E0F7FA',
              color: '#00796B',
              fontWeight: 500,
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
