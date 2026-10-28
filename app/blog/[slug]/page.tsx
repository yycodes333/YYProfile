import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CoverBlock } from '@/components/ui/CoverBlock';
import { Reveal } from '@/components/motion/Reveal';
import { getPostBySlug, getPostNeighbors, getRelatedPosts, posts } from '@/lib/content/posts';
import { buildPageMetadata } from '@/lib/seo/metadata';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: '文章未找到' };

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedAt: post.publishedAt,
  });
}

export default async function BlogDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.slug);
  const { prev, next } = getPostNeighbors(post.slug);

  return (
    <div className="container page-shell">
      <article>
        <Reveal as="header" className="detail-hero" variant="up">
          <div className="meta-row">
            <span className="tag">{post.categoryLabel}</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span>{post.readingTime} 分钟阅读</span>
          </div>
          <h1>{post.title}</h1>
          <p className="lead">{post.excerpt}</p>
          <div className="detail-cover">
            <CoverBlock title={post.title} subtitle={post.categoryLabel} tone={post.coverTone} />
          </div>
        </Reveal>

        <div className="detail-body prose-width">
          {post.sections.map((section, index) => (
            <Reveal
              as="section"
              key={section.heading}
              delay={60 * index}
              variant="up"
              aria-labelledby={`section-${section.heading}`}
            >
              <h2 id={`section-${section.heading}`}>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </Reveal>
          ))}
        </div>
      </article>

      {prev || next ? (
        <nav className="neighbor-nav" aria-label="文章翻页">
          {next ? (
            <Link className="neighbor-card" href={`/blog/${next.slug}`} key={next.slug}>
              <span className="neighbor-label">较早一篇 · {next.publishedAt}</span>
              <span className="neighbor-title">{next.title}</span>
            </Link>
          ) : (
            <span className="neighbor-spacer" aria-hidden="true" />
          )}
          {prev ? (
            <Link className="neighbor-card is-next" href={`/blog/${prev.slug}`} key={prev.slug}>
              <span className="neighbor-label">较新一篇 · {prev.publishedAt}</span>
              <span className="neighbor-title">{prev.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      <Reveal as="section" className="section" variant="up" aria-labelledby="related-posts-title">
        <div className="section-heading">
          <h2 id="related-posts-title">其他笔记</h2>
          <Link className="text-link" href="/blog">
            返回列表 →
          </Link>
        </div>
        <div className="post-grid">
          {relatedPosts.map((item, index) => (
            <Reveal key={item.slug} delay={70 * index} variant="scale">
              <Link className="post-card" href={`/blog/${item.slug}`}>
                <span className="tag">{item.categoryLabel}</span>
                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
