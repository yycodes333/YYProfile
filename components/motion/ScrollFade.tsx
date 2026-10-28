'use client';

import { useEffect } from 'react';
import { prefersReducedMotion, registerScrollFade } from '@/components/motion/scrollFadeRegistry';

/** 把页面里标记了 `data-scroll-fade` 的块接入滚动淡出。 */
export function ScrollFade() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-fade]'));
    const releases = nodes.map((node) => registerScrollFade(node));

    return () => releases.forEach((release) => release());
  }, []);

  return null;
}
