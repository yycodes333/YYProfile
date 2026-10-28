'use client';

import { useId, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { SkillChip } from '@/components/ui/SkillChip';
import type { SkillCategory } from '@/lib/content/skills';

type SkillOrbitProps = {
  categories: readonly SkillCategory[];
};

/** 每张卡片绕一圈的秒数：卡片越多越慢，线速度大致稳定。 */
const SECONDS_PER_CARD = 12;

/** 箭头沿椭圆的取点角度，均匀分布在四个象限。 */
const ARROW_ANGLES = [24, 114, 204, 294];
const TRACK_RX = 248;
const TRACK_RY = 148;
const TRACK_CX = 250;
const TRACK_CY = 150;

/** 把椭圆上的参数角换算成 SVG 的平移 + 旋转，让箭头顺着运动方向。 */
function arrowTransform(deg: number) {
  const t = (deg * Math.PI) / 180;
  const x = TRACK_CX + TRACK_RX * Math.cos(t);
  const y = TRACK_CY + TRACK_RY * Math.sin(t);
  const dx = -TRACK_RX * Math.sin(t);
  const dy = TRACK_RY * Math.cos(t);
  const rotate = (Math.atan2(dy, dx) * 180) / Math.PI;
  return `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rotate.toFixed(1)})`;
}

export function SkillOrbit({ categories }: SkillOrbitProps) {
  const uid = useId();
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const [locked, setLocked] = useState(false);
  const [pointerInside, setPointerInside] = useState(false);

  const active = useMemo(
    () => categories.find((category) => category.id === activeId) ?? categories[0],
    [activeId, categories],
  );

  const arrows = useMemo(() => ARROW_ANGLES.map(arrowTransform), []);

  if (!active) return null;

  const count = active.items.length;
  const duration = `${SECONDS_PER_CARD * count}s`;
  const paused = locked || pointerInside;
  const gradientId = `${uid}-line`;
  const glowId = `${uid}-glow`;

  return (
    <div className="skill-orbit" data-paused={paused ? 'true' : 'false'}>
      <div className="skill-orbit-cats" role="group" aria-label="选择技能分类">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className="skill-cat"
            aria-pressed={category.id === active.id}
            onClick={() => setActiveId(category.id)}
          >
            <span className="skill-cat-label">{category.label}</span>
            <span className="skill-cat-count">{String(category.items.length).padStart(2, '0')}</span>
          </button>
        ))}
        <p className="skill-cat-caption">{active.caption}</p>
      </div>

      <div
        className="skill-orbit-stage"
        style={{ '--orbit-duration': duration } as CSSProperties}
      >
        {/* 只有轨道区域参与 hover 暂停，暂停按钮必须留在外面，否则点了「继续」仍被 hover 按住 */}
        <div
          className="orbit-field"
          onPointerEnter={() => setPointerInside(true)}
          onPointerLeave={() => setPointerInside(false)}
        >
        <svg
          className="orbit-track"
          viewBox="0 0 500 300"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.45" />
              <stop offset="55%" stopColor="#4f46e5" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.38" />
            </linearGradient>
            <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="7" />
            </filter>
          </defs>
          <ellipse
            cx={TRACK_CX}
            cy={TRACK_CY}
            rx={TRACK_RX}
            ry={TRACK_RY}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="22"
            opacity="0.22"
            filter={`url(#${glowId})`}
          />
          <ellipse
            className="orbit-track-line"
            cx={TRACK_CX}
            cy={TRACK_CY}
            rx={TRACK_RX}
            ry={TRACK_RY}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="1.5"
            strokeDasharray="3 12"
            strokeLinecap="round"
          />
          {arrows.map((transform) => (
            <polygon
              key={transform}
              points="-7,-5.5 6,0 -7,5.5"
              transform={transform}
              fill="#4f46e5"
              opacity="0.5"
            />
          ))}
        </svg>

        <ul className="orbit-list" aria-label={`${active.label}技能`}>
          {active.items.map((skill, index) => (
            <li
              className="orbit-item"
              key={`${active.id}-${skill.name}`}
              style={{ animationDelay: `${-SECONDS_PER_CARD * index}s` } as CSSProperties}
            >
              <SkillChip skill={skill} />
            </li>
          ))}
        </ul>
        </div>

        <button
          type="button"
          className="orbit-pause"
          aria-pressed={locked}
          onClick={() => setLocked((value) => !value)}
        >
          <span className="orbit-pause-icon" aria-hidden="true">
            {locked ? '▶' : '❚❚'}
          </span>
          <span>{locked ? '继续转动' : '暂停转动'}</span>
        </button>
      </div>
    </div>
  );
}
