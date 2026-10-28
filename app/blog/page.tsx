import type { Metadata } from 'next';
import Link from 'next/link';
import { CoverBlock } from '@/components/ui/CoverBlock';
import { Reveal } from '@/components/motion/Reveal';
import {
  getPostCategories,
  getPosts,
  hasActivePostFilters,
} from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = buildPageMetadata({
  title: '笔记',
  description: '机器人、工程实践与学习方法的记录：PiPER 抓取、Git、Typora 与学习路线。',
  path: '/blog',
});

type SearchParams = Promise<{ category?: string }>;

const categories = getPostCategories();

function buildHref(category: string) {
  return category ? `/blog?category=${category}` : '/blog';
}

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const category = params.category ?? '';
  const filtered = getPosts({ category });
  const active = hasActivePostFilters({ category });
  const activeLabel = categories.find((item) => item.value === category)?.label;

  return (
    <div className="container page-shell">
      <Reveal as="header" className="detail-hero" variant="up">
        <span className="eyebrow">Notes</span>
        <h1>笔记与方法</h1>
        <p className="lead">
          记录机器人、工程实践与学习方法，也把踩过的坑整理成可以复用的步骤。
        </p>
      </Reveal>

      <Reveal
        className="filter-bar"
        as="section"
        role="group"
        aria-label="按分类筛选文章"
        variant="fade"
        delay={60}
      >
        <span className="filter-label">分类</span>
        <Link
          href={buildHref('')}
          className={`filter-chip${category === '' ? ' is-active' : ''}`}
          aria-current={category === '' ? 'true' : undefined}
        >
          全部
        </Link>
        {categories.map((item) => (
          <Link
            key={item.value}
            href={buildHref(item.value)}
            className={`filter-chip${category === item.value ? ' is-active' : ''}`}
            aria-current={category === item.value ? 'true' : undefined}
          >
            {item.label}
          </Link>
        ))}
      </Reveal>

      {active ? (
        <p className="filter-summary" role="status">
          当前分类：{activeLabel ?? category}，共 {filtered.length} 篇。
          <Link className="text-link" href="/blog">
            清除筛选 →
          </Link>
        </p>
      ) : null}

      {filtered.length === 0 ? (
        <Reveal className="empty-state" variant="scale">
          <h2>没有符合条件的文章</h2>
          <p>试试清除分类，查看全部笔记。</p>
          <Link className="button" href="/blog">
            清除筛选
          </Link>
        </Reveal>
      ) : (
        <div className="post-grid">
          {filtered.map((post, index) => (
            <Reveal key={post.slug} delay={80 * index} variant="scale">
              <Link className="post-card post-card-covered" href={`/blog/${post.slug}`}>
                <div className="post-card-cover">
                  <CoverBlock
                    title={post.title}
                    subtitle={post.categoryLabel}
                    tone={post.coverTone}
                  />
                </div>
                <div className="post-card-body">
                  <div className="meta-row">
                    <span className="tag">{post.categoryLabel}</span>
                    <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                    <span>{post.readingTime} 分钟阅读</span>
                  </div>
                  <h2 className="post-card-title">{post.title}</h2>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
