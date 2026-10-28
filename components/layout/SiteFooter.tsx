import Link from 'next/link';
import { HomeLink } from '@/components/layout/HomeLink';
import { BackToTop } from '@/components/ui/BackToTop';
import { siteConfig } from '@/lib/constants';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <p>
          © {new Date().getFullYear()} {siteConfig.name} · {siteConfig.role}
        </p>
        <div className="footer-links">
          <HomeLink />
          <Link href="/#about">关于</Link>
          <Link href="/#work">作品</Link>
          <Link href="/#certs">证书</Link>
          <Link href="/#contact">联系</Link>
          <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
          <BackToTop className="footer-to-top">返回顶部</BackToTop>
        </div>
      </div>
    </footer>
  );
}
