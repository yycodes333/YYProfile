'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type CountUpProps = {
  to: number;
  /** 动画时长，保持短于 1s，避免数字长时间跳动 */
  duration?: number;
};

/**
 * 首帧渲染最终值以保证水合一致，进入视口后再从 0 递增。
 */
export function CountUp({ to, duration = 800 }: CountUpProps): ReactNode {
  const [value, setValue] = useState(to);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) {
            frame = window.requestAnimationFrame(step);
          }
        };
        frame = window.requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [to, duration]);

  return <span ref={ref}>{value}</span>;
}
