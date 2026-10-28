'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { navLinks, siteConfig } from '@/lib/constants';

/** 首页区块的滚动高亮：视口中线所在的区块决定导航态。 */
const SECTION_IDS = navLinks.map((link) => link.section);

/** 详情页没有对应锚点，用路由前缀回填所属区块。 */
function sectionFromPath(pathname: string) {
  if (pathname.startsWith('/projects')) return 'work';
  if (pathname.startsWith('/blog')) return 'notes';
  return '';
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spy, setSpy] = useState<{ path: string; id: string }>({ path: '/', id: '' });
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // 详情页由路由前缀决定所属区块；首页交给滚动观察
  const activeSection =
    pathname === '/' ? (spy.path === pathname ? spy.id : '') : sectionFromPath(pathname);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector('a')?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (pathname !== '/') return;

    const nodes = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = visible[0];
        if (first) setSpy({ path: pathname, id: first.target.id });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;

      // 进度条每帧变化，直接写 transform，避免滚动触发整棵组件树重渲染
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${ratio.toFixed(4)})`;
      }
      setScrolled((previous) => (previous === window.scrollY > 8 ? previous : window.scrollY > 8));
    }

    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }

    frame = window.requestAnimationFrame(update);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  /** 已在首页时自行滚动，避免重复点击同一 hash 时 Next 不再触发滚动。 */
  const handleNavClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
      setOpen(false);
      if (pathname !== '/') return;

      const node = document.getElementById(target);
      if (!node) return;

      event.preventDefault();
      node.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${target}`);
    },
    [pathname],
  );

  const handleBrandClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      setOpen(false);
      if (pathname !== '/') return;
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', '/');
    },
    [pathname],
  );

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`} id="top">
      <div className="container">
        <div className="header-inner">
          <Link className="brand" href="/" onClick={handleBrandClick}>
            {siteConfig.name}
            <span>{siteConfig.nameEn}</span>
          </Link>

          <nav className="nav-desktop" aria-label="主导航">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={activeSection === link.section ? 'location' : undefined}
                onClick={(event) => handleNavClick(event, link.section)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="visually-hidden">{open ? '关闭菜单' : '打开菜单'}</span>
            <span className="menu-toggle-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav
          ref={panelRef}
          id={panelId}
          className="nav-mobile"
          aria-label="移动导航"
          data-open={open}
          hidden={!open}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={activeSection === link.section ? 'location' : undefined}
              onClick={(event) => handleNavClick(event, link.section)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <span ref={barRef} className="scroll-progress" aria-hidden="true" />
    </header>
  );
}
