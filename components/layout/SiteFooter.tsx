import Link from 'next/link';
import { siteConfig } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} {siteConfig.name} · 用作品记录成长</p>
        <div className="footer-links">
          <Link href="/projects">项目</Link>
          <Link href="/blog">博客</Link>
          <Link href="/contact">联系</Link>
          <a href="#top">返回顶部</a>
        </div>
      </div>
    </footer>
  );
}
