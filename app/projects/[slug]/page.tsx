import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CoverBlock } from '@/components/ui/CoverBlock';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { Reveal } from '@/components/motion/Reveal';
import {
  getProjectBySlug,
  getProjectFigures,
  getProjectNeighbors,
  getRelatedProjects,
  projects,
} from '@/lib/content/projects';
import { buildPageMetadata } from '@/lib/seo/metadata';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: '项目未找到' };

  return buildPageMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const related = getRelatedProjects(project.slug);
  const { prev, next } = getProjectNeighbors(project.slug);
  const processFigures = getProjectFigures(project.slug, 'process');
  const resultFigures = getProjectFigures(project.slug, 'result');

  return (
    <div className="container page-shell">
      <Reveal as="header" className="detail-hero" variant="up">
        <div className="meta-row">
          <span className="tag">{project.typeLabel}</span>
          <span>{project.period}</span>
        </div>
        <h1>{project.title}</h1>
        <p className="lead">{project.summary}</p>
        <p>
          <strong className="strong-inline">角色：</strong>
          {project.role}
        </p>
        {project.links?.length ? (
          <div className="project-links">
            {project.links.map((link) => {
              const external = link.href.startsWith('http');
              return (
                <a
                  className="button secondary"
                  key={link.href}
                  href={link.href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                >
                  {link.label}
                  {external ? <span aria-hidden="true"> ↗</span> : null}
                </a>
              );
            })}
          </div>
        ) : null}
        <div className="detail-cover">
          <ProjectCover
            title={project.title}
            subtitle={project.typeLabel}
            tone={project.coverTone}
            image={project.coverImage}
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      </Reveal>

      <div className="detail-body">
        <Reveal as="section" variant="up" delay={40} aria-labelledby="problem-title">
          <h2 id="problem-title">问题与背景</h2>
          <p>{project.problem}</p>
        </Reveal>

        <Reveal as="section" variant="up" delay={80} aria-labelledby="goals-title">
          <h2 id="goals-title">目标与职责</h2>
          <p>
            <strong className="strong-inline">我负责：</strong>
            {project.role}
          </p>
          <ul>
            {project.goals.map((goal) => (
              <li key={goal}>{goal}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="section" variant="up" delay={120} aria-labelledby="process-title">
          <h2 id="process-title">过程</h2>
          <ul>
            {project.process.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          {processFigures.length > 0 ? (
            <div className="figure-grid">
              {processFigures.map((figure, index) => (
                <Reveal
                  key={figure.caption}
                  delay={60 * index}
                  variant="scale"
                  className="figure-cell"
                >
                  <div className="figure-frame" data-ratio={figure.ratio}>
                    {figure.image ? (
                      <Image
                        src={figure.image.src}
                        alt={figure.image.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className={`cover-media${figure.image.fit === 'contain' ? ' is-contain' : ''}`}
                      />
                    ) : (
                      <CoverBlock title={figure.caption} subtitle="过程记录" tone={figure.tone} />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal as="section" variant="up" aria-labelledby="results-title">
          <h2 id="results-title">成果要点</h2>
          <ul>
            {project.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
        </Reveal>

        {project.video ? (
          <Reveal as="section" variant="up" aria-labelledby="video-title">
            <h2 id="video-title">{project.video.title}</h2>
            <figure className="project-video">
              <video
                controls
                preload="none"
                playsInline
                poster={project.video.poster}
                aria-label={project.video.title}
              >
                <source src={project.video.src} type="video/mp4" />
                你的浏览器不支持视频播放，可下载后观看。
              </video>
              <figcaption>点击播放后加载视频，不自动播放、不自动发声。</figcaption>
            </figure>
          </Reveal>
        ) : null}

        <Reveal as="section" variant="scale" delay={80} aria-labelledby="stack-title">
          <h2 id="stack-title">技术栈</h2>
          <div className="marquee">
            <ul className="stack-list marquee-track">
              {project.stack.map((item) => (
                <li className="tag" key={item}>
                  {item}
                </li>
              ))}
              {project.stack.map((item) => (
                <li className="tag" key={`repeat-${item}`} aria-hidden="true">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {resultFigures.length > 0 ? (
        <Reveal
          as="section"
          className="ink-panel detail-gallery"
          variant="up"
          aria-labelledby="gallery-title"
        >
          <span className="eyebrow">Gallery · 项目记录</span>
          <h2 id="gallery-title">过程与结果</h2>
          <div className="figure-grid figure-grid-ink">
            {resultFigures.map((figure, index) => (
              <Reveal key={figure.caption} delay={70 * index} variant="up" className="figure-cell">
                <div className="figure-frame" data-ratio={figure.ratio}>
                  {figure.image ? (
                    <Image
                      src={figure.image.src}
                      alt={figure.image.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 420px"
                      className={`cover-media${figure.image.fit === 'contain' ? ' is-contain' : ''}`}
                    />
                  ) : (
                    <CoverBlock title={figure.caption} subtitle="项目记录" tone={figure.tone} />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      ) : null}

      <nav className="neighbor-nav" aria-label="案例翻页">
        {prev ? (
          <Link className="neighbor-card" href={`/projects/${prev.slug}`} key={prev.slug}>
            <span className="neighbor-label">← 上一个项目</span>
            <span className="neighbor-title">{prev.title}</span>
          </Link>
        ) : null}
        {next ? (
          <Link className="neighbor-card is-next" href={`/projects/${next.slug}`} key={next.slug}>
            <span className="neighbor-label">下一个项目 →</span>
            <span className="neighbor-title">{next.title}</span>
          </Link>
        ) : null}
      </nav>

      <Reveal as="section" className="section" variant="up" aria-labelledby="related-projects-title">
        <div className="section-heading">
          <h2 id="related-projects-title">相关项目</h2>
          <Link className="text-link" href="/projects">
            返回作品列表 →
          </Link>
        </div>
        <div className="post-grid">
          {related.map((item, index) => (
            <Reveal key={item.slug} delay={70 * index} variant="scale">
              <Link className="post-card" href={`/projects/${item.slug}`}>
                <span className="tag">{item.typeLabel}</span>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
