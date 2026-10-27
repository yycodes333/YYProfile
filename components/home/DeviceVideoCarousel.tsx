'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { LocalVideo } from '@/components/media/LocalVideo';

export type CarouselVideo = {
  id: string;
  title: string;
  description?: string;
  src: string;
  poster?: string;
};

type DeviceVideoCarouselProps = {
  videos: readonly CarouselVideo[];
  className?: string;
};

export function DeviceVideoCarousel({ videos, className }: DeviceVideoCarouselProps) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const touchStartX = useRef<number | null>(null);

  const count = videos.length;
  const current = videos[index];

  const goTo = useCallback(
    (nextIndex: number, dir: 1 | -1) => {
      if (count === 0) return;
      const normalized = ((nextIndex % count) + count) % count;
      setDirection(dir);
      setIndex(normalized);
    },
    [count],
  );

  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (event.key === 'ArrowLeft') prev();
      if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (!current || count === 0) return null;

  return (
    <div className={`device-carousel${className ? ` ${className}` : ''}`}>
      <div
        className="laptop-frame"
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        onTouchStart={(event) => {
          touchStartX.current = event.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const start = touchStartX.current;
          const end = event.changedTouches[0]?.clientX;
          touchStartX.current = null;
          if (start == null || end == null) return;
          const delta = end - start;
          if (Math.abs(delta) < 40) return;
          if (delta > 0) prev();
          else next();
        }}
      >
        <div className="laptop-lid">
          <div className="laptop-bezel">
            <span className="laptop-camera" aria-hidden="true" />
            <div
              className={`laptop-screen slide-${direction > 0 ? 'next' : 'prev'}`}
              key={current.id}
            >
              <LocalVideo
                src={current.src}
                title={current.title}
                poster={current.poster}
                className="device-screen-video"
              />
            </div>
          </div>
        </div>
        <div className="laptop-base" aria-hidden="true">
          <span className="laptop-notch" />
        </div>
      </div>

      <div className="device-carousel-meta">
        <p className="device-carousel-index" id={labelId}>
          {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </p>
        <h3 className="device-carousel-title">{current.title}</h3>
        {current.description ? <p className="device-carousel-desc">{current.description}</p> : null}
      </div>

      <div className="slide-controls" aria-label="视频轮播控制">
        <button type="button" className="slide-arrow" onClick={prev} aria-label="上一个视频">
          <span aria-hidden="true">←</span>
        </button>
        <div className="slide-dots" role="tablist" aria-label="选择视频">
          {videos.map((video, i) => (
            <button
              key={video.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`切换到：${video.title}`}
              className={`slide-dot${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i, i > index ? 1 : -1)}
            />
          ))}
        </div>
        <button type="button" className="slide-arrow" onClick={next} aria-label="下一个视频">
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
