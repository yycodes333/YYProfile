import Link from 'next/link';
import { siteConfig } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.role}
        </p>
        <div className="footer-links">
          <Link href="/projects">作品</Link>
          <Link href="/blog">笔记</Link>
          <Link href="/#contact">联系</Link>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <a href="#top">返回顶部</a>
        </div>
      </div>
    </footer>
  );
}
