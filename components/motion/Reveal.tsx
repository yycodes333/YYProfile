'use client';

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { prefersReducedMotion, registerScrollFade } from '@/components/motion/scrollFadeRegistry';

type RevealVariant = 'up' | 'fade' | 'left' | 'scale';

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms for list-like reveals */
  delay?: number;
  /** Motion style inspired by scroll-reveal portfolios */
  variant?: RevealVariant;
  as?: 'div' | 'section' | 'article' | 'li' | 'header';
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

/** 级联延迟上限：让列表依次入场看得见，又不至于尾部内容迟迟不出现。 */
const MAX_STAGGER_MS = 420;

/** 与 `.reveal` 的 CSS 过渡时长保持一致，用于入场结束后的接管兜底。 */
const ENTRY_MS = 640;

export function Reveal({
  children,
  className,
  delay = 0,
  variant = 'up',
  as: Tag = 'div',
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // 只做一次性入场：进入视口即定型并断开观察，避免滚动来回重复播放
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const stagger = Math.min(delay, MAX_STAGGER_MS);

  // 入场过渡结束后把 opacity 交给滚动淡出：两者不同时写同一个属性，避免互相拖慢
  useEffect(() => {
    if (!visible) return;

    const node = ref.current;
    if (!node || prefersReducedMotion()) return;

    let release: (() => void) | null = null;
    let handedOver = false;

    const handover = () => {
      if (handedOver || !node.isConnected) return;
      handedOver = true;
      node.style.transition = 'none';
      release = registerScrollFade(node);
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== node || event.propertyName !== 'opacity') return;
      handover();
    };

    const timer = window.setTimeout(handover, ENTRY_MS + stagger + 160);
    node.addEventListener('transitionend', onTransitionEnd);

    return () => {
      node.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(timer);
      release?.();
    };
  }, [visible, stagger]);

  const style: CSSProperties | undefined = stagger ? { transitionDelay: `${stagger}ms` } : undefined;
  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={`reveal reveal-${variant}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
