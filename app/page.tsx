import type { Metadata } from 'next';
import Image from 'next/image';
import { AboutPinwall } from '@/components/home/AboutPinwall';
import { Certifications } from '@/components/home/Certifications';
import { SkillOrbit } from '@/components/home/SkillOrbit';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollFade } from '@/components/motion/ScrollFade';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { VideoFrame } from '@/components/ui/VideoFrame';
import { WaveTransition } from '@/components/ui/WaveTransition';
import { siteConfig } from '@/lib/constants';
import {
  bilibiliVideos,
  getProjectBySlug,
  localDemos,
  type BilibiliVideo,
  type LocalDemo,
} from '@/lib/content/projects';
import { aboutIntro } from '@/lib/content/profile';
import { skillCategories } from '@/lib/content/skills';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  description: `${siteConfig.headline} ${siteConfig.tagline} 一页看完关于、技能、作品、证书与联系方式。`,
  path: '/',
});

function BilibiliCard({ video }: { video: BilibiliVideo }) {
  return (
    <article className="work-card" data-scroll-fade>
      <a className="work-card-inner" href={video.href} target="_blank" rel="noopener noreferrer">
        <div className="work-media" style={{ aspectRatio: '16 / 9' }}>
          <Image
            src={video.cover}
            alt={video.alt}
            fill
            sizes="(max-width: 900px) 92vw, 46vw"
            className="cover-media"
          />
        </div>
        <div className="work-body">
          <div className="meta-row">
            <span className="tag">B 站</span>
            <span>视频讲解</span>
          </div>
          <h4>{video.title}</h4>
          <p>{video.note}</p>
        </div>
      </a>
    </article>
  );
}

function DemoCard({ demo }: { demo: LocalDemo }) {
  return (
    <VideoFrame
      src={demo.src}
      title={demo.title}
      poster={demo.poster}
      note={demo.note}
      variant={demo.frame}
      fallback={demo.fallback}
    />
  );
}

export default function HomePage() {
  const notesProject = getProjectBySlug('piper-learning-notes');
  const graspingProject = getProjectBySlug('piper-grasping');

  return (
    <div className="home-page">
      <ScrollFade />
      <div className="container">
        {/* Hero 保持静态：姓名与身份不等待任何动画 */}
        <section className="home-hero" aria-labelledby="home-hero-title" data-scroll-fade>
          <div className="home-hero-copy">
            <h1 id="home-hero-title" className="hero-name" tabIndex={-1}>
              {siteConfig.name}
            </h1>
            <p className="hero-role">{siteConfig.heroRole}</p>
          </div>

          <div className="home-hero-visual">
            <span className="hero-halo" aria-hidden="true" />
            <div className="hero-visual">
              <Image
                src="/images/个人01.jpg"
                alt={`${siteConfig.name}在海边岩石上的照片`}
                fill
                priority
                sizes="(max-width: 900px) 70vw, 360px"
                className="cover-media"
              />
            </div>
          </div>
        </section>

        <WaveTransition />

        <Reveal as="section" id="about" className="section" aria-labelledby="about-title">
          <h2 id="about-title" className="section-title" data-scroll-fade>
            <a href="#about">关于</a>
          </h2>

          <div className="about-intro" data-scroll-fade>
            <p className="about-intro-text">{aboutIntro.body}</p>
            <figure className="about-intro-media">
              <Image
                src={aboutIntro.photo.src}
                alt={aboutIntro.photo.alt}
                fill
                sizes="(max-width: 900px) 92vw, 38vw"
                className="cover-media"
              />
            </figure>
          </div>

          <AboutPinwall />
        </Reveal>

        <Reveal as="section" id="skills" className="section" aria-labelledby="skills-title">
          <h2 id="skills-title" className="section-title" data-scroll-fade>
            <a href="#skills">技能</a>
          </h2>
          <p className="lead" data-scroll-fade>
            五类技术在星空里自由漂浮，把鼠标停在任意一张卡片上就能定格细看。
          </p>
          <SkillOrbit categories={skillCategories} />
        </Reveal>

        <Reveal as="section" id="work" className="section" aria-labelledby="work-title">
          <h2 id="work-title" className="section-title" data-scroll-fade>
            <a href="#work">作品</a>
          </h2>

          <div className="work-group">
            <div className="work-group-head" data-scroll-fade>
              <h3>GitHub 项目</h3>
              <p>仓库里能看到大纲、代码与实验记录。</p>
            </div>
            <div className="work-grid">
              {notesProject ? (
                <article
                  className="work-card"
                  data-static="true"
                  data-media="screenshot"
                  data-scroll-fade
                >
                  <div className="work-card-inner">
                    <div className="work-media">
                      <ProjectCover
                        title={notesProject.title}
                        subtitle={notesProject.typeLabel}
                        tone={notesProject.coverTone}
                        image={notesProject.coverImage}
                        sizes="(max-width: 900px) 92vw, 46vw"
                      />
                    </div>
                    <div className="work-body">
                      <div className="meta-row">
                        <span className="tag">{notesProject.typeLabel}</span>
                        <span>{notesProject.period}</span>
                      </div>
                      <h4>{notesProject.title}</h4>
                      <p>{notesProject.summary}</p>
                    </div>
                  </div>
                </article>
              ) : null}

              {graspingProject ? (
                <article
                  className="work-card"
                  data-static="true"
                  data-media="portrait"
                  data-scroll-fade
                >
                  <div className="work-card-inner">
                    <div className="work-media">
                      <ProjectCover
                        title={graspingProject.title}
                        subtitle={graspingProject.typeLabel}
                        tone={graspingProject.coverTone}
                        image={graspingProject.coverImage}
                        sizes="(max-width: 900px) 92vw, 46vw"
                      />
                    </div>
                    <div className="work-body">
                      <div className="meta-row">
                        <span className="tag">{graspingProject.typeLabel}</span>
                        <span>{graspingProject.period}</span>
                      </div>
                      <h4>{graspingProject.title}</h4>
                      <p>{graspingProject.summary}</p>
                    </div>
                  </div>
                </article>
              ) : null}
            </div>
          </div>

          <div className="work-group">
            <div className="work-group-head" data-scroll-fade>
              <h3>B 站视频讲解</h3>
              <p>把新手最容易卡住的地方录成可以跟着做的步骤。</p>
            </div>
            <div className="work-grid">
              {bilibiliVideos.map((video) => (
                <BilibiliCard key={video.href} video={video} />
              ))}
            </div>
          </div>

          <div className="work-group">
            <div className="work-group-head" data-scroll-fade>
              <h3>配套视频演示</h3>
              <p>站内录屏，点击后才加载播放。</p>
            </div>
            <div className="work-grid">
              {localDemos.map((demo) => (
                <DemoCard key={demo.id} demo={demo} />
              ))}
            </div>
          </div>
        </Reveal>

        <Certifications />

        <Reveal as="section" id="contact" className="section" aria-labelledby="contact-title">
          <h2 id="contact-title" className="section-title" data-scroll-fade>
            <a href="#contact">联系</a>
          </h2>
          <p className="lead" data-scroll-fade>
            想聊聊机械臂、具身智能或学习方法？
          </p>

          <Reveal as="div" className="ink-cta spaced-top" variant="up">
            <div>
              <span className="eyebrow">仍在学习</span>
              <h3>有想法就直接说，不用客套。</h3>
              <p>项目合作、视频选题、学习路线，都可以发邮件过来。</p>
            </div>
            <div className="actions">
              <a className="button" href={`mailto:${siteConfig.contactEmail}`}>
                发送邮件
              </a>
            </div>
          </Reveal>
        </Reveal>
      </div>
    </div>
  );
}
