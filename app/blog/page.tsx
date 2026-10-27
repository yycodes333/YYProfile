import type { Metadata } from 'next';
import { DeviceVideoCarousel } from '@/components/home/DeviceVideoCarousel';
import { Reveal } from '@/components/motion/Reveal';
import { blogVideos } from '@/lib/content/featured';

export const metadata: Metadata = {
  title: '博客',
  description: '苑阳的学习笔记与工具分享：机械臂控制、具身智能，以及自学路上的踩坑与解法。',
};

const stats = [
  { label: '粉丝', value: '400' },
  { label: '总获赞', value: '1,657' },
  { label: '总播放', value: '10.2 万' },
];

export default function BlogPage() {
  return (
    <div className="container blog-page">
      <header className="blog-hero">
        <span className="eyebrow">BLOG · 分享与记录</span>
        <h1>把踩过的坑，整理成能帮到人的笔记。</h1>
        <p>
          我是一名大学生，主要研究机械臂控制、具身智能。自学路上磕磕绊绊，网上知识又杂又乱，找资料特别折腾。
          所以打算把自己遇到的问题、踩过的坑和对应的解决方法整理出来，分享已经学会的内容，希望能帮到同样在这条路摸索的伙伴。
        </p>
      </header>

      <section className="blog-body" aria-labelledby="blog-share-title">
        <div className="blog-prose">
          <h2 id="blog-share-title">正在分享的内容</h2>
          <p>
            下方预览框展示视频第一帧，点击后本地播放；可用左右箭头或圆点快速切换，不依赖第三方自动加载。
          </p>
        </div>

        <Reveal>
          <DeviceVideoCarousel videos={blogVideos} />
        </Reveal>

        <div className="blog-prose blog-prose-follow">
          <p>
            感恩大家的喜爱与支持。目前粉丝 400，总获赞 1657，总播放 10.2 万，我也会继续坚持学习、更新内容。
            欢迎来找我一起交流。
          </p>
        </div>

        <div className="blog-stats" aria-label="B站数据概览">
          {stats.map((item) => (
            <div className="blog-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <aside className="blog-connect" aria-label="B站主页">
          <div className="blog-connect-copy">
            <span className="eyebrow">CONNECT · B站</span>
            <h2>欢迎来找我一起交流</h2>
            <p>
              B 站 ID：<span className="blog-id">bili_2643652625</span>
            </p>
          </div>
          <a
            className="button blog-connect-link"
            href="https://space.bilibili.com/1505111583?spm_id_from=333.1007.0.0"
            target="_blank"
            rel="noopener noreferrer"
          >
            访问 B 站主页
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </section>
    </div>
  );
}
