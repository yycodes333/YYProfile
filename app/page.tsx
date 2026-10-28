import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AboutStory } from '@/components/home/AboutStory';
import { SkillOrbit } from '@/components/home/SkillOrbit';
import { ContactForm } from '@/components/contact/ContactForm';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { VideoFrame } from '@/components/ui/VideoFrame';
import { siteConfig } from '@/lib/constants';
import { getFeaturedPosts, posts } from '@/lib/content/posts';
import {
  bilibiliVideos,
  getProjectBySlug,
  localDemos,
  projects,
  type BilibiliVideo,
  type LocalDemo,
} from '@/lib/content/projects';
import { profile } from '@/lib/content/profile';
import { skillCategories } from '@/lib/content/skills';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  description: `${siteConfig.headline} ${siteConfig.tagline} 一页看完关于、技能、作品、笔记与联系方式。`,
  path: '/',
});

function BilibiliCard({ video }: { video: BilibiliVideo }) {
  return (
    <article className="work-card" data-layout="stack">
      <a
        className="work-card-inner"
        href={video.href}
        target="_blank"
        rel="noopener noreferrer"
      >
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
  const featuredPosts = getFeaturedPosts().slice(0, 3);
  const notesProject = getProjectBySlug('piper-learning-notes');
  const graspingProject = getProjectBySlug('piper-grasping');

  return (
    <div className="home-page">
      <div className="container">
        {/* Hero 保持静态：姓名、主张、CTA 不等待任何动画 */}
        <section className="home-hero" aria-labelledby="home-hero-title">
          <div className="home-hero-copy">
            <span className="eyebrow">{siteConfig.role}</span>
            <h1 id="home-hero-title" className="display-font">
              {siteConfig.name}
            </h1>
            <p className="claim">{siteConfig.headline}</p>
            <p className="lead">{siteConfig.tagline}</p>
            <div className="actions">
              <a className="button" href="#work">
                查看作品
              </a>
              <a className="button secondary" href="#contact">
                联系我
              </a>
            </div>
          </div>

          <div className="home-hero-visual">
            <span className="hero-plate" aria-hidden="true" />
            <div className="hero-visual">
              <Image
                src="/images/个人01.jpg"
                alt={`${siteConfig.name}在海边岩石上的照片`}
                fill
                priority
                sizes="(max-width: 900px) 80vw, 400px"
                className="cover-media"
              />
            </div>
          </div>
        </section>

        <p className="trust-line">
          <span>
            项目案例 × <CountUp to={projects.length} />
          </span>
          <span aria-hidden="true">·</span>
          <span>
            技术笔记 × <CountUp to={posts.length} />
          </span>
          <span aria-hidden="true">·</span>
          <span>邮箱可联系</span>
        </p>

        <Reveal as="section" id="about" className="section" aria-labelledby="about-title">
          <div className="section-heading">
            <div>
              <a className="eyebrow-link" href="#about">
                关于
              </a>
              <h2 id="about-title">先认识一下我。</h2>
            </div>
          </div>
          <p className="lead about-lead">{profile.aboutLead}</p>

          <AboutStory />

          <div className="about-facts">
            <Reveal as="div" className="about-fact" variant="up">
              <h3>我做什么</h3>
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
            </Reveal>

            <Reveal as="div" className="about-fact" variant="up" delay={80}>
              <h3>经历</h3>
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
            </Reveal>

            <Reveal as="div" className="about-fact" variant="up" delay={140}>
              <h3>教育</h3>
              <div className="skill-card">
                <h4>
                  {profile.education.school} · {profile.education.major}
                </h4>
                <p>
                  {profile.education.period}。{profile.education.note}
                </p>
              </div>
              <p className="about-now">{profile.now}</p>
            </Reveal>
          </div>
        </Reveal>

        <Reveal as="section" id="skills" className="section" aria-labelledby="skills-title">
          <div className="section-heading">
            <div>
              <a className="eyebrow-link" href="#skills">
                技能
              </a>
              <h2 id="skills-title">把学过的技术摆到台面上。</h2>
            </div>
          </div>
          <p className="lead">
            按分类整理正在学、练过和已经落到项目里的技术。角标只表示使用深度，不打熟练度分数。
          </p>
          <SkillOrbit categories={skillCategories} />
        </Reveal>

        <Reveal as="section" id="work" className="section" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <a className="eyebrow-link" href="#work">
                作品
              </a>
              <h2 id="work-title">项目、讲解与演示。</h2>
            </div>
          </div>

          <div className="work-group">
            <div className="work-group-head">
              <h3>GitHub 项目</h3>
              <p>仓库里能看到大纲、代码与实验记录。</p>
            </div>
            <div className="work-grid">
              {notesProject ? (
                <article className="work-card" data-layout="split" data-span="wide">
                  <Link className="work-card-inner" href={`/projects/${notesProject.slug}`}>
                    <div className="work-media" style={{ aspectRatio: '16 / 9' }}>
                      <ProjectCover
                        title={notesProject.title}
                        subtitle={notesProject.typeLabel}
                        tone={notesProject.coverTone}
                        image={notesProject.coverImage}
                        sizes="(max-width: 900px) 92vw, 58vw"
                      />
                    </div>
                    <div className="work-body">
                      <div className="meta-row">
                        <span className="tag">{notesProject.typeLabel}</span>
                        <span>{notesProject.period}</span>
                      </div>
                      <h4>{notesProject.title}</h4>
                      <p>{notesProject.summary}</p>
                      <span className="work-cta">查看项目详情 →</span>
                    </div>
                  </Link>
                </article>
              ) : null}

              {graspingProject ? (
                <article className="work-card" data-layout="stack">
                  <Link className="work-card-inner" href={`/projects/${graspingProject.slug}`}>
                    <div className="work-media" style={{ aspectRatio: '4 / 3' }}>
                      <ProjectCover
                        title={graspingProject.title}
                        subtitle={graspingProject.typeLabel}
                        tone={graspingProject.coverTone}
                        image={graspingProject.coverImage}
                        sizes="(max-width: 900px) 92vw, 30vw"
                      />
                    </div>
                    <div className="work-body">
                      <div className="meta-row">
                        <span className="tag">{graspingProject.typeLabel}</span>
                        <span>{graspingProject.period}</span>
                      </div>
                      <h4>{graspingProject.title}</h4>
                      <p>{graspingProject.summary}</p>
                      <span className="work-cta">查看项目详情 →</span>
                    </div>
                  </Link>
                </article>
              ) : null}
            </div>
          </div>

          <div className="work-group">
            <div className="work-group-head">
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
            <div className="work-group-head">
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

        <Reveal as="section" id="notes" className="section" aria-labelledby="notes-title">
          <div className="section-heading">
            <div>
              <a className="eyebrow-link" href="#notes">
                笔记
              </a>
              <h2 id="notes-title">学习笔记。</h2>
            </div>
          </div>
          <div className="post-grid">
            {featuredPosts.map((post, index) => (
              <Reveal key={post.slug} delay={70 * index} variant="scale">
                <Link className="post-card" href={`/blog/${post.slug}`}>
                  <div className="meta-row">
                    <span className="tag">{post.categoryLabel}</span>
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    <span>{post.readingTime} 分钟</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" id="contact" className="section" aria-labelledby="contact-title">
          <div className="section-heading">
            <div>
              <a className="eyebrow-link" href="#contact">
                联系
              </a>
              <h2 id="contact-title">想聊聊机械臂、具身智能或学习方法？</h2>
            </div>
          </div>

          <div className="contact-layout">
            <Reveal as="div" variant="left">
              <h3>邮箱与频道</h3>
              <ul className="channel-list">
                <li>
                  <a href={`mailto:${siteConfig.contactEmail}`}>
                    <strong>公开邮箱</strong>
                    <span>{siteConfig.contactEmail}</span>
                  </a>
                </li>
                {siteConfig.socialLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      <strong>
                        {link.label}
                        <span className="visually-hidden">（外部链接）</span>
                      </strong>
                      <span>{link.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal as="div" variant="up" delay={80}>
              <h3>留言</h3>
              <p>填写后会发送到我的邮箱，请留下常用地址方便回复。</p>
              <ContactForm />
            </Reveal>
          </div>

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
              <a className="button secondary" href="#top">
                回到顶部
              </a>
            </div>
          </Reveal>
        </Reveal>
      </div>
    </div>
  );
}
