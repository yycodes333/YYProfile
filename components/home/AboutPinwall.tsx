'use client';

import Image from 'next/image';
import { useState } from 'react';
import { profile, profileGallery } from '@/lib/content/profile';

type Panel = 'work' | 'experience' | 'education';

/** 选中哪张照片就展开哪块内容：01–02 我做什么，03–04 经历，05 教育。 */
const PANEL_BY_INDEX: Panel[] = ['work', 'work', 'experience', 'experience', 'education'];

const PANEL_LABELS: Record<Panel, string> = {
  work: '我做什么',
  experience: '经历',
  education: '教育',
};

export function AboutPinwall() {
  const [panel, setPanel] = useState<Panel>('work');

  return (
    <div className="pinwall" data-scroll-fade>
      <ul className="pinwall-row">
        {profileGallery.map((photo, index) => {
          const target = PANEL_BY_INDEX[index] ?? 'work';
          const active = panel === target;

          return (
            <li key={photo.src}>
              <button
                type="button"
                className="pinwall-item"
                aria-pressed={active}
                onPointerEnter={() => setPanel(target)}
                onFocus={() => setPanel(target)}
                onClick={() => setPanel(target)}
              >
                <span className="pinwall-pin" aria-hidden="true" />
                <span className="pinwall-frame">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 900px) 45vw, 18vw"
                    className="pinwall-photo"
                  />
                </span>
                <span className="pinwall-index" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="pinwall-panel" aria-live="polite">
        <p className="pinwall-tab">
          {PANEL_LABELS[panel]}
          <span aria-hidden="true"> · </span>
          <span className="pinwall-hint">把鼠标移到照片上切换</span>
        </p>

        {panel === 'work' ? (
          <ul className="highlight-list">
            {profile.workItems.map((item, index) => (
              <li key={item.title}>
                <span className="highlight-mark" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong className="strong-inline">{item.title}</strong>：{item.description}
              </li>
            ))}
          </ul>
        ) : null}

        {panel === 'experience' ? (
          <ol className="timeline">
            {profile.experiences.map((item) => (
              <li key={item.id}>
                <div className="period">{item.period}</div>
                <h4>
                  {item.title} · {item.organization}
                </h4>
                <p>{item.description}</p>
              </li>
            ))}
          </ol>
        ) : null}

        {panel === 'education' ? (
          <div className="skill-card">
            <h4>
              {profile.education.school} · {profile.education.major}
            </h4>
            <p>
              {profile.education.period}。{profile.education.note}
            </p>
            <p className="pinwall-now">{profile.now}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
