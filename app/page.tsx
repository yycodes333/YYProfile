import Image from 'next/image';
import Link from 'next/link';
import { DeviceVideoCarousel } from '@/components/home/DeviceVideoCarousel';
import { Reveal } from '@/components/motion/Reveal';
import {
  aboutHighlights,
  blogVideos,
  featuredProject,
  featuredSkills,
} from '@/lib/content/featured';
import { siteConfig } from '@/lib/constants';

export default function HomePage() {
  const email = siteConfig.contactEmail;
  const mailtoHref = email
    ? `mailto:${email}?subject=${encodeURIComponent('来自个人网站的联络')}`
    : '/contact';

  return (
    <div className="home-page">
      <div className="ambient-layer" aria-hidden="true">
        <span className="ambient-orb ambient-orb-a" />
        <span className="ambient-orb ambient-orb-b" />
        <span className="ambient-orb ambient-orb-c" />
        <span className="ambient-grid" />
      </div>

      <div className="container">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <Reveal className="home-hero-copy">
            <span className="eyebrow">Personal portfolio · 苑阳</span>
            <h1 id="home-hero-title">
              你好，我是<span>苑阳</span>
              <br />
              用技术把想法做成可运行的系统。
            </h1>
            <p>
              大连民族大学大三本科生，关注机械臂开发与具身智能。这里汇集个人介绍、技能实践、项目案例与学习分享。
            </p>
            <div className="actions">
              <Link className="button" href="/projects">
                查看项目
              </Link>
              <Link className="button secondary" href="/contact">
                联系我
              </Link>
            </div>
          </Reveal>
          <Reveal className="home-hero-visual" delay={120}>
            <figure className="home-portrait">
              <Image
                src="/images/个人01.jpg"
                alt="苑阳的个人照片"
                width={720}
                height={900}
                priority
                sizes="(max-width: 800px) 72vw, 320px"
              />
              <figcaption>
                {siteConfig.name}
                <span> · {siteConfig.role}</span>
              </figcaption>
            </figure>
          </Reveal>
        </section>

        <Reveal as="section" className="home-section home-about" aria-labelledby="home-about-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">About · 关于我</span>
              <h2 id="home-about-title">先认识一下，我是谁、在做什么。</h2>
            </div>
            <Link className="text-link" href="/about">
              完整介绍 →
            </Link>
          </div>
          <div className="home-about-grid">
            <p className="home-about-lead">
              比起停留在想法，我更享受让方案真正运行起来，并在一次次验证中把它打磨得更好。研究兴趣围绕机械臂与具身智能，也乐于把踩过的坑整理成可分享的笔记。
            </p>
            <ul className="home-highlight-list">
              {aboutHighlights.map((item, i) => (
                <Reveal as="li" key={item} delay={80 * (i + 1)}>
                  <span className="home-highlight-mark" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item}
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal as="section" className="home-section" aria-labelledby="home-skills-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Skills · 技能</span>
              <h2 id="home-skills-title">用真实实践呈现能力。</h2>
            </div>
            <Link className="text-link" href="/skills">
              全部技能 →
            </Link>
          </div>
          <div className="skills-grid home-skills-grid">
            {featuredSkills.map((group, i) => (
              <Reveal as="article" className="skill-card" key={group.number} delay={70 * i}>
                <span className="skill-number">{group.number}</span>
                <h3>{group.title}</h3>
                <p>{group.summary}</p>
                <ul className="skill-tags" aria-label={`${group.title}技能`}>
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="home-section" aria-labelledby="home-projects-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Projects · 项目</span>
              <h2 id="home-projects-title">把想法做成作品。</h2>
            </div>
            <Link className="text-link" href="/projects">
              查看项目 →
            </Link>
          </div>
          <Reveal className="project-card home-project-card" delay={80}>
            <figure className="project-cover">
              <Image
                src={featuredProject.cover}
                alt={`${featuredProject.title} 仓库截图`}
                fill
                sizes="(max-width: 800px) 100vw, 680px"
              />
              <figcaption className="cover-caption">GitHub 仓库主页</figcaption>
            </figure>
            <div className="project-info">
              <div className="project-meta">
                <span>个人项目</span>
                <span className="project-index">01</span>
              </div>
              <h3>{featuredProject.title}</h3>
              <p>{featuredProject.summary}</p>
              <ul className="project-tags" aria-label="项目标签">
                {featuredProject.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <a
                className="project-link"
                href={featuredProject.repoUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`在 GitHub 打开 ${featuredProject.title} 仓库`}
              >
                查看 GitHub 仓库 <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>
        </Reveal>

        <Reveal as="section" className="home-section home-videos" aria-labelledby="home-videos-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Blog videos · 博客视频</span>
              <h2 id="home-videos-title">学习笔记，可点击播放。</h2>
            </div>
            <Link className="text-link" href="/blog">
              进入博客 →
            </Link>
          </div>
          <p className="home-section-lead">
            视频默认展示第一帧预览，不自动播放。可用左右箭头、圆点或滑动快速切换。
          </p>
          <Reveal delay={100}>
            <DeviceVideoCarousel videos={blogVideos} />
          </Reveal>
        </Reveal>

        <Reveal as="section" className="home-section home-contact" aria-labelledby="home-contact-title">
          <div className="home-contact-panel">
            <div>
              <span className="eyebrow">Contact · 联系</span>
              <h2 id="home-contact-title">一起聊聊想法与合作</h2>
              <p>
                欢迎通过表单、邮件或 B 站主页交流技术讨论、项目合作或任何想法。
              </p>
            </div>
            <div className="home-contact-actions">
              <Link className="button" href="/contact">
                前往联系页
              </Link>
              <a className="button secondary" href={mailtoHref}>
                发送邮件
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
