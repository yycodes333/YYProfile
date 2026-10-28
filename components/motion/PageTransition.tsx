'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

/**
 * 路由变化时重挂载容器以播放翻阅动效；容器只做 opacity/位移，
 * 内容仍由服务端渲染输出，不拦截导航、后退与键盘操作。
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
