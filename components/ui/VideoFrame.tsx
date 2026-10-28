import Link from 'next/link';
import { LocalVideo } from '@/components/media/LocalVideo';

type VideoFrameProps = {
  src: string;
  title: string;
  poster?: string;
  note?: string;
  /** 电视框带支脚，镜框是浮起的细边相框 */
  variant?: 'tv' | 'mirror';
  fallback?: {
    label: string;
    href: string;
    external?: boolean;
  };
};

/** 把本地视频装进电视 / 镜框：点击才加载播放，不自动播放、不自动出声。 */
export function VideoFrame({
  src,
  title,
  poster,
  note,
  variant = 'tv',
  fallback,
}: VideoFrameProps) {
  return (
    <figure className="tv-frame" data-variant={variant}>
      <div className="tv-bezel">
        <span className="tv-camera" aria-hidden="true" />
        <div className="tv-screen">
          <LocalVideo src={src} title={title} poster={poster} className="tv-video" />
        </div>
      </div>
      {variant === 'tv' ? <div className="tv-stand" aria-hidden="true" /> : null}
      <figcaption className="tv-caption">
        <strong>{title}</strong>
        {note ? <span>{note}</span> : null}
        {fallback ? (
          fallback.external ? (
            <a
              className="text-link"
              href={fallback.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {fallback.label}
              <span className="visually-hidden">（外部链接）</span>
            </a>
          ) : (
            <Link className="text-link" href={fallback.href}>
              {fallback.label}
            </Link>
          )
        ) : null}
      </figcaption>
    </figure>
  );
}
