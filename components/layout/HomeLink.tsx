'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToTop } from '@/components/motion/scrollToTop';

type HomeLinkProps = {
  className?: string;
  children?: React.ReactNode;
};

/** 首页入口：其他路由走正常导航，已经在首页时顶栏是 sticky，锚点不生效所以改用脚本。 */
export function HomeLink({ className, children = '首页' }: HomeLinkProps) {
  const pathname = usePathname();

  return (
    <Link
      className={className}
      href="/#top"
      onClick={(event) => {
        if (pathname !== '/') return;
        event.preventDefault();
        scrollToTop();
        window.history.replaceState(null, '', '/');
      }}
    >
      {children}
    </Link>
  );
}
