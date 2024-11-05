import type {Metadata} from 'next';
import {DM_Mono, Instrument_Sans} from 'next/font/google';

import './globals.css';

const fontSans = Instrument_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
});

const fontMono = DM_Mono({
  variable: '--font-mono',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Ocra',
  description:
    'Fast, ultra-accurate text extraction from any image or PDF, even challenging ones, with structured markdown output.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}
