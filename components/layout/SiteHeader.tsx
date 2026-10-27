import Link from 'next/link';

const links = [
  ['关于我', '/about'], ['技能', '/skills'], ['项目', '/projects'], ['博客', '/blog'], ['联系', '/contact'],
];

export function SiteHeader() {
  return <header className="site-header" id="top"><div className="container header-inner">
    <Link className="brand" href="/">苑阳</Link>
    <nav className="nav" aria-label="主导航">
      <Link href="/">首页</Link>
      {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
    </nav>
  </div></header>;
}
