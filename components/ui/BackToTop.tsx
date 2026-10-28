'use client';

import { type ReactNode } from 'react';
import { scrollToTopAndFocus } from '@/components/motion/scrollToTop';

type BackToTopProps = {
  className?: string;
  children?: ReactNode;
};

/** 首屏标题的 id：滚回顶端后把焦点交回这里。 */
const FOCUS_TARGET_ID = 'home-hero-title';

/** 返回顶部是页内操作而不是导航，所以用 button；`href="#top"` 对 sticky 顶栏不起作用。 */
export function BackToTop({
  className = 'button secondary',
  children = '回到顶部',
}: BackToTopProps) {
  return (
    <button type="button" className={className} onClick={() => scrollToTopAndFocus(FOCUS_TARGET_ID)}>
      {children}
    </button>
  );
}
