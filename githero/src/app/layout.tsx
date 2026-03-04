import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const orbitron = Orbitron({
  variable: '--font-orbitron',
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GitHub Hero — Discover Your Developer Power Level',
  description:
    'Analyze your GitHub profile and find out which legendary hero — Marvel, DC, or Anime — matches your developer power level.',
  keywords: ['GitHub', 'developer', 'hero', 'anime', 'marvel', 'dc', 'power level', 'coding'],
  openGraph: {
    title: 'GitHub Hero Analyzer',
    description: 'Discover which legendary hero matches your GitHub coding style.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable} antialiased bg-[#08080f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
