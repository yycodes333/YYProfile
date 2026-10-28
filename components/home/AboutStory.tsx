import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { profileStory } from '@/lib/content/profile';
import type { CSSProperties } from 'react';

/** 关于区的图文段落：图片层缓速推近，文字紧随其后，形成滚动时的镜头感。 */
export function AboutStory() {
  return (
    <div className="about-story">
      {profileStory.map((item, index) => (
        <Reveal
          as="article"
          className={`story-row story-${item.align}`}
          key={item.id}
          delay={70 * index}
          variant="up"
        >
          <figure
            className="story-media"
            style={{ '--story-ratio': item.photo.ratio } as CSSProperties}
          >
            <div className="story-frame">
              <Image
                src={item.photo.src}
                alt={item.photo.alt}
                fill
                sizes="(max-width: 900px) 92vw, 44vw"
                className="story-photo"
              />
            </div>
            <figcaption>{item.kicker}</figcaption>
          </figure>
          <div className="story-copy">
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
