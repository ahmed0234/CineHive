import type { Metadata } from 'next';
import { Geist, Geist_Mono, BBH_Sans_Bartle } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import OpeningAnimation from '@/components/OpeningAnimation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
const bbhbartel = BBH_Sans_Bartle({
  variable: '--font-bbhbartet',
  subsets: ['latin'],
  weight: ['400'],
  fallback: ['Roboto'],
});

const sdAsian = localFont({
  src: '../public/fonts/sdasian.woff2',
  variable: '--font-sdasian',
});

export const metadata: Metadata = {
  title: 'CineHive',
  description:
    'Cinehive is a cutting-edge movie app designed to keep you updated with the latest blockbusters and hidden gems. Whether you’re looking for the newest releases, cast details, or official trailers, Cinehive has it all at your fingertips. Built with a seamless user experience in mind, this app offers an intuitive interface and quick access to all movie-related information.Discover the latest movie releases and trailers. Access detailed information about each movie, including cast, crew, plot summaries, and ratings. Watch trailers right from the app with high-quality streaming. Built with Next.js for a fast and reliable performance. Styled using Tailwind CSS for a sleek, modern look. Components powered by ShadCN, ensuring a smooth, responsive experience across all devices. Developed by Ahmed Hassan, Cinehive is the go-to app for movie enthusiasts who want to stay in the loop about the latest in cinema. Whether you’re planning your next movie night or just curious about an upcoming release, Cinehive delivers everything you need to know in one place.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${sdAsian.className} ${geistSans.variable} ${geistMono.variable} ${bbhbartel.variable} ${sdAsian.className} antialiased font-sans`}
      >
        <OpeningAnimation />
        {/* <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange> */}
        <main className="font-sans">{children}</main>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
