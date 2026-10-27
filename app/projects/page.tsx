import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '项目',
  description: '个人项目与实践案例。',
};

const project = {
  title: 'Only Me Notebook',
  slug: 'only-me-notebook',
  summary: '面向 AgileX PiPER 机械臂智能抓取的系统学习笔记与项目路线，串联 Python、机器人学、RGB-D 视觉、深度学习、ROS 2 / MoveIt 2 与机械臂集成实践。',
  repoUrl: 'https://github.com/yycodes333/only-me-notebook',
  tags: ['Markdown', '机器人学', 'ROS 2', 'PiPER'],
  cover: '/images/projects/only-me-notebook.png',
};

export default function ProjectsPage() {
  return (
    <div className="container projects-page">
      <header className="projects-hero">
        <span className="eyebrow">Selected work · 01</span>
        <h1>把想法，<span>做成作品。</span></h1>
        <p>项目记录的不只是结果，也包括每一次探索与实践。</p>
        <div className="projects-count"><strong>01</strong><span>个项目</span></div>
      </header>

      <section className="projects-list" aria-label="项目列表">
        <article className="project-card">
          <figure className="project-cover">
            <Image src={project.cover} alt="Only Me Notebook 的 GitHub 仓库主页与 README 项目介绍截图" fill priority sizes="(max-width: 800px) 100vw, 680px" />
            <figcaption className="cover-caption">GitHub 仓库主页</figcaption>
          </figure>
          <div className="project-info">
            <div className="project-meta"><span>个人项目</span><span className="project-index">01 / 01</span></div>
            <h2>{project.title}</h2>
            <p>{project.summary}</p>
            <ul className="project-tags" aria-label="项目标签">
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <a className="project-link" href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`在 GitHub 打开 ${project.title} 仓库`}>
              查看 GitHub 仓库 <span aria-hidden="true">↗</span>
            </a>
          </div>
        </article>
        <p className="project-note"><span aria-hidden="true">i</span> 项目截图采自公开 GitHub 仓库主页；仓库 README 提供完整课程大纲与当前学习进度。</p>
      </section>
    </div>
  );
}
