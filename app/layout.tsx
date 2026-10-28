import type { Metadata, Viewport } from 'next';
import { Inter, Newsreader } from 'next/font/google';
import localFont from 'next/font/local';
import { HashScroll } from '@/components/motion/HashScroll';
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

/** 只包含姓名、角色与五个区块标题所需汉字的子集，约 8 KB。 */
const serif = localFont({
  src: './fonts/NotoSerifSC-Subset.ttf',
  display: 'swap',
  weight: '500',
  variable: '--font-serif-loaded',
});

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#07080f',
};

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
      <body className={`${sans.variable} ${display.variable} ${serif.variable} site-body`}>
        <SiteHeader />
        <main id="top">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter />
        <HashScroll />
      </body>
    </html>
  );
}
