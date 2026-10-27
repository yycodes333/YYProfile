import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: { default: '苑阳 · My Profile', template: '%s | 苑阳' },
  description: '苑阳的个人展示网站：机械臂、具身智能、项目实践与学习分享。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${sans.variable} site-body`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
