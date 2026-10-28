import type { Metadata } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import { PageTransition } from '@/components/motion/PageTransition';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { siteConfig } from '@/lib/constants';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} · ${siteConfig.role}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: `${siteConfig.headline} ${siteConfig.tagline}`,
  openGraph: {
    title: `${siteConfig.name} · ${siteConfig.role}`,
    description: `${siteConfig.headline} ${siteConfig.tagline}`,
    url: '/',
    siteName: `${siteConfig.name} · 个人作品集`,
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: `${siteConfig.name} · ${siteConfig.role}`,
    description: `${siteConfig.headline}`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} ${display.variable} site-body`}>
        <SiteHeader />
        <main>
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
