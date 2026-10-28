'use client';

import { useEffect, useRef } from 'react';
import type { SkillCategory } from '@/lib/content/skills';

type SkillOrbitProps = {
  categories: readonly SkillCategory[];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  seed: number;
  homeAngle: number;
};

const MAX_SPEED = 72;
const MIN_SPEED = 26;

/**
 * 技能星轨：五张分类卡在椭圆内部无规律漂浮。
 * 位置由 requestAnimationFrame 直接写到 DOM，避免每帧触发 React 重渲染；
 * 只有鼠标停进某张卡片时才让整片星空定格（触屏不触发，避免一碰就永久暂停）。
 */
export function SkillOrbit({ categories }: SkillOrbitProps) {
  const fieldRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const pausedRef = useRef<Set<number>>(new Set());
  const particlesRef = useRef<Particle[]>([]);
  const sizesRef = useRef<Array<{ w: number; h: number }>>([]);

  /** 只在鼠标指针下暂停；指针离开最后一张卡片时恢复。 */
  const setPaused = (index: number, paused: boolean) => {
    const item = itemRefs.current[index];
    if (paused) {
      pausedRef.current.add(index);
      item?.setAttribute('data-paused', 'true');
    } else {
      pausedRef.current.delete(index);
      item?.removeAttribute('data-paused');
    }
  };

  useEffect(() => {
    const field = fieldRef.current;
    const items = itemRefs.current.filter((item): item is HTMLLIElement => item !== null);
    if (!field || items.length === 0) return;

    let frame = 0;
    let last = performance.now();
    let width = field.clientWidth;
    let height = field.clientHeight;

    const measure = () => {
      width = field.clientWidth;
      height = field.clientHeight;
      sizesRef.current = items.map((item) => ({
        w: item.offsetWidth,
        h: item.offsetHeight,
      }));
    };

    const seedParticles = () => {
      const rx = width / 2;
      const ry = height / 2;
      particlesRef.current = items.map((_, index) => {
        const homeAngle = (Math.PI * 2 * index) / items.length + (Math.random() - 0.5) * 0.5;
        const radius = 0.42 + Math.random() * 0.12;
        const direction = Math.random() * Math.PI * 2;
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
        return {
          x: Math.cos(homeAngle) * rx * radius,
          y: Math.sin(homeAngle) * ry * radius,
          vx: Math.cos(direction) * speed,
          vy: Math.sin(direction) * speed,
          seed: Math.random() * 100,
          homeAngle,
        };
      });
    };

    const applyTransforms = () => {
      particlesRef.current.forEach((particle, index) => {
        const item = items[index];
        if (!item) return;
        item.style.transform = `translate(calc(-50% + ${particle.x.toFixed(2)}px), calc(-50% + ${particle.y.toFixed(2)}px))`;
      });
    };

    const settle = () => {
      measure();
      seedParticles();
      applyTransforms();
      field.dataset.ready = 'true';
    };

    settle();

    const update = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;

      // 窄屏是静态网格，CSS 已经接管位置；这里只负责不再写 transform。
      if (window.matchMedia('(max-width: 900px)').matches) {
        items.forEach((item) => {
          item.style.transform = '';
        });
        frame = window.requestAnimationFrame(update);
        return;
      }

      if (!pausedRef.current.size) {
        const rx = width / 2;
        const ry = height / 2;
        const time = now / 1000;
        const particles = particlesRef.current;

        particles.forEach((particle, index) => {
          const size = sizesRef.current[index] ?? { w: 180, h: 100 };
          const innerRx = Math.max(40, rx - (size.w / 2) * Math.SQRT2 - 28);
          const innerRy = Math.max(30, ry - (size.h / 2) * Math.SQRT2 - 28);

          // 每张卡有自己的缓慢漂移“家”，避免五张卡长期挤在一起。
          const homeAngle = particle.homeAngle + time * 0.04;
          const homeX = Math.cos(homeAngle) * rx * 0.56;
          const homeY = Math.sin(homeAngle) * ry * 0.56;
          particle.vx += (homeX - particle.x) * 0.28 * dt;
          particle.vy += (homeY - particle.y) * 0.28 * dt;

          // 缓慢变化的加速度，让轨迹不是规则圆周。
          particle.vx += Math.sin(time * 0.65 + particle.seed) * 12 * dt;
          particle.vy += Math.cos(time * 0.55 + particle.seed * 1.7) * 12 * dt;

          const speed = Math.hypot(particle.vx, particle.vy);
          if (speed > MAX_SPEED) {
            particle.vx = (particle.vx / speed) * MAX_SPEED;
            particle.vy = (particle.vy / speed) * MAX_SPEED;
          }

          particle.x += particle.vx * dt;
          particle.y += particle.vy * dt;

          // 椭圆边界：先求法线反射，再把中心推回内侧。
          const nx = particle.x / (innerRx * innerRx);
          const ny = particle.y / (innerRy * innerRy);
          if (nx * particle.x + ny * particle.y > 1) {
            const length = Math.hypot(nx, ny) || 1;
            const ux = nx / length;
            const uy = ny / length;
            const dot = particle.vx * ux + particle.vy * uy;
            if (dot > 0) {
              particle.vx -= 2 * dot * ux;
              particle.vy -= 2 * dot * uy;
            }

            const norm =
              Math.sqrt(
                (particle.x * particle.x) / (innerRx * innerRx) +
                  (particle.y * particle.y) / (innerRy * innerRy),
              ) || 1;
            const scale = 0.985 / norm;
            particle.x *= scale;
            particle.y *= scale;
          }

          // 轻微互斥，避免五张卡长时间叠在一起。
          particles.forEach((other, otherIndex) => {
            if (otherIndex <= index) return;
            const dx = particle.x - other.x;
            const dy = particle.y - other.y;
            const distance = Math.hypot(dx, dy);
            const otherSize = sizesRef.current[otherIndex] ?? { w: 180, h: 100 };
            const minDistance = ((size.w + otherSize.w) / 2) * 0.95;

            if (distance > 0 && distance < minDistance) {
              const force = (minDistance - distance) / minDistance;
              const ux = dx / distance;
              const uy = dy / distance;
              // 直接把重叠的卡片推开，避免只靠加速度时长时间叠在一起
              const push = (minDistance - distance) * 0.5;
              particle.x += ux * push;
              particle.y += uy * push;
              other.x -= ux * push;
              other.y -= uy * push;
              particle.vx += ux * force * 60 * dt;
              particle.vy += uy * force * 60 * dt;
              other.vx -= ux * force * 60 * dt;
              other.vy -= uy * force * 60 * dt;
            }
          });
        });

        particles.forEach((particle, index) => {
          items[index].style.transform = `translate(calc(-50% + ${particle.x.toFixed(2)}px), calc(-50% + ${particle.y.toFixed(2)}px))`;
        });
      }

      frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);

    const observer = new ResizeObserver(() => {
      settle();
    });
    observer.observe(field);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [categories.length]);

  return (
    <div className="skill-orbit" data-scroll-fade>
      <div className="orbit-field" ref={fieldRef}>
        <div className="orbit-ellipse" aria-hidden="true">
          <div className="orbit-sky">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/星空2.gif"
              alt=""
              loading="lazy"
              decoding="async"
              onError={(event) => {
                // 新素材缺失时退回旧图，避免椭圆空白。
                const image = event.currentTarget;
                if (image.dataset.fallback === 'true') return;
                image.dataset.fallback = 'true';
                image.src = '/images/星空.gif';
              }}
            />
          </div>
        </div>

        <ul className="orbit-list" aria-label="技能分类">
          {categories.map((category, index) => (
            <li
              className="orbit-item"
              key={category.id}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                  setPaused(index, true);
                }
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
                  setPaused(index, false);
                }
              }}
            >
              <article className="skill-category-card">
                <h3>{category.label}</h3>
                <p>{category.items.map((item) => item.name).join(' · ')}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}