'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * 首屏带 hash 的深链接（含 /about → /#about 这类重定向）容易在 hydration
 * 后被 Next 的滚动恢复顶回顶部，这里在挂载后补一次定位。
 */
const RETRY_DELAYS = [0, 120, 400];

export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const timers = RETRY_DELAYS.map((delay) =>
      window.setTimeout(() => {
        const node = document.getElementById(hash);
        if (node) node.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, delay),
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [pathname]);

  return null;
}
