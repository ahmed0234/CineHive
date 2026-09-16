import type { Metadata } from 'next';
import { Geist, Geist_Mono, BBH_Sans_Bartle } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

const bbhbartel = BBH_Sans_Bartle({
  variable: '--font-bbhbartet',
  subsets: ['latin'],
  weight: ['400'],
  fallback: ['Roboto'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CineHive - Discover Movies & TV Shows',
  description:
    'CineHive is a cutting-edge movie app to keep you updated with the latest blockbusters and hidden gems. Discover releases, trailers, cast details, and ratings with an instant and smooth experience.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bbhbartel.variable} antialiased font-sans bg-background text-foreground`}
      >
        <main className="font-sans">{children}</main>
      </body>
    </html>
  );
}
