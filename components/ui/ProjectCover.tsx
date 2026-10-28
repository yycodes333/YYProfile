import Image from 'next/image';
import { CoverBlock } from '@/components/ui/CoverBlock';

type ProjectCoverProps = {
  title: string;
  subtitle?: string;
  tone?: 'warm' | 'ink' | 'violet';
  image?: {
    src: string;
    alt: string;
    fit?: 'cover' | 'contain';
  };
  sizes?: string;
  priority?: boolean;
};

export function ProjectCover({
  title,
  subtitle,
  tone = 'warm',
  image,
  sizes = '(max-width: 900px) 100vw, 55vw',
  priority = false,
}: ProjectCoverProps) {
  if (!image) {
    return <CoverBlock title={title} subtitle={subtitle} tone={tone} />;
  }

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`cover-media${image.fit === 'contain' ? ' is-contain' : ''}`}
    />
  );
}
