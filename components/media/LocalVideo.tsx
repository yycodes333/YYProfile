'use client';

import { useEffect, useRef, useState } from 'react';
import { useVideoPoster } from '@/components/media/useVideoPoster';

type LocalVideoProps = {
  src: string;
  title: string;
  poster?: string;
  className?: string;
  /** Capture first frame when no poster is provided */
  capturePoster?: boolean;
};

export function LocalVideo({
  src,
  title,
  poster,
  className,
  capturePoster = true,
}: LocalVideoProps) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const capturedPoster = useVideoPoster(src, capturePoster && !poster && !active);
  const resolvedPoster = poster || capturedPoster;

  useEffect(() => {
    if (!active || !videoRef.current) return;
    void videoRef.current.play().catch(() => {
      /* Autoplay may be blocked; controls remain available. */
    });
  }, [active]);

  return (
    <div className={`local-video${className ? ` ${className}` : ''}`}>
      {active ? (
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          preload="metadata"
          poster={resolvedPoster}
          title={title}
        >
          你的浏览器不支持视频播放。
        </video>
      ) : (
        <button
          type="button"
          className="local-video-trigger"
          onClick={() => setActive(true)}
          aria-label={`播放视频：${title}`}
        >
          {resolvedPoster ? (
            // Decorative poster; accessible name comes from the button label.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={resolvedPoster} alt="" className="local-video-poster" />
          ) : (
            <span className="local-video-fallback" aria-hidden="true" />
          )}
          <span className="local-video-play" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M8 5.14v13.72L19 12 8 5.14z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
