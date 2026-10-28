import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectCover } from '@/components/ui/ProjectCover';
import { Reveal } from '@/components/motion/Reveal';
import {
  getProjectTags,
  getProjects,
  hasActiveFilters,
  projects,
  type ProjectType,
} from '@/lib/content/projects';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: '作品',
  description: '三个项目：PiPER 机械臂医药用品抓取、智能抓取学习教案与学生开发工具教学视频。',
  path: '/projects',
});

type SearchParams = Promise<{ type?: string; tag?: string }>;

const typeFilters: { label: string; value: '' | ProjectType }[] = [
  { label: '全部', value: '' },
  { label: '机械臂', value: 'robotics' },
  { label: '学习教案', value: 'notes' },
  { label: '教学视频', value: 'teaching' },
];

const tagFilters = getProjectTags();

/** 筛选条件全部写进 URL，便于分享、刷新保留与浏览器返回。 */
function buildHref(next: { type: string; tag: string }) {
  const params = new URLSearchParams();
  if (next.type) params.set('type', next.type);
  if (next.tag) params.set('tag', next.tag);
  const query = params.toString();
  return query ? `/projects?${query}` : '/projects';
}

export default async function ProjectsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const type = (params.type ?? '') as '' | ProjectType;
  const tag = params.tag ?? '';
  const filtered = getProjects({ type, tag });
  const active = hasActiveFilters({ type, tag });

  return (
    <div className="container page-shell">
      <Reveal as="header" className="detail-hero" variant="up">
        <span className="eyebrow">Work</span>
        <h1>作品</h1>
        <p className="lead">
          {projects.length} 个项目，覆盖机械臂抓取、学习路线整理与开发工具教学。
        </p>
      </Reveal>

      <div className="filter-groups">
        <Reveal
          className="filter-bar"
          as="section"
          role="group"
          aria-label="按项目类型筛选"
          variant="fade"
          delay={60}
        >
          <span className="filter-label">类型</span>
          {typeFilters.map((filter) => {
            const href = buildHref({ type: filter.value, tag });
            const isActive = type === filter.value;
            return (
              <Link
                key={filter.label}
                href={href}
                className={`filter-chip${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {filter.label}
              </Link>
            );
          })}
        </Reveal>

        <Reveal
          className="filter-bar"
          as="section"
          role="group"
          aria-label="按技术标签筛选"
          variant="fade"
          delay={120}
        >
          <span className="filter-label">技术标签</span>
          <Link
            href={buildHref({ type, tag: '' })}
            className={`filter-chip${tag === '' ? ' is-active' : ''}`}
            aria-current={tag === '' ? 'true' : undefined}
          >
            全部
          </Link>
          {tagFilters.map((item) => {
            const isActive = tag === item;
            return (
              <Link
                key={item}
                href={buildHref({ type, tag: isActive ? '' : item })}
                className={`filter-chip${isActive ? ' is-active' : ''}`}
                aria-current={isActive ? 'true' : undefined}
              >
                {item}
              </Link>
            );
          })}
        </Reveal>
      </div>

      {active ? (
        <p className="filter-summary" role="status">
          当前筛选：{type ? typeFilters.find((f) => f.value === type)?.label : '全部类型'}
          {tag ? ` · ${tag}` : ''}，共 {filtered.length} 个项目。
          <Link className="text-link" href="/projects">
            清除筛选 →
          </Link>
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <Reveal className="empty-state" variant="scale">
          <h2>没有符合条件的项目</h2>
          <p>试试清除筛选，查看全部项目。</p>
          <Link className="button" href="/projects">
            清除筛选
          </Link>
        </Reveal>
      ) : (
        <div className="stack-grid">
          {filtered.map((project, index) => (
            <Reveal key={project.slug} delay={90 * index} variant="up">
              <Link className="project-row" href={`/projects/${project.slug}`}>
                <div className="project-row-media">
                  <ProjectCover
                    title={project.title}
                    subtitle={project.typeLabel}
                    tone={project.coverTone}
                    image={project.coverImage}
                  />
                </div>
                <div className="project-row-body">
                  <div className="meta-row">
                    <span className="tag">{project.typeLabel}</span>
                    <span>{project.period}</span>
                  </div>
                  <h2 className="project-row-title">{project.title}</h2>
                  <p>{project.summary}</p>
                  <p className="project-row-role">{project.role}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
