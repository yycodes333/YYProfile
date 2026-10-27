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

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms for list-like reveals */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li';
} & Omit<HTMLAttributes<HTMLElement>, 'children' | 'className' | 'style'>;

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced-motion users get final styles from CSS; skip JS animation state.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay ? { transitionDelay: `${delay}ms` } : undefined;
  const Component = Tag as ElementType;

  return (
    <Component
      ref={ref}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
