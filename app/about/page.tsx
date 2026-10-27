import Image from 'next/image';
import type { Metadata } from 'next';
import { LocalVideo } from '@/components/media/LocalVideo';

export const metadata: Metadata = {
  title: '关于我',
  description: '苑阳，大连民族大学大三本科生，关注机械臂开发与具身智能。',
};

const focusAreas = ['机械臂开发', '具身智能', '机器人项目实践'];

export default function AboutPage() {
  return (
    <div className="container about-page">
      <section className="about-intro" aria-labelledby="about-title">
        <div className="about-copy">
          <span className="eyebrow">ABOUT ME · 个人介绍</span>
          <h1 id="about-title">你好，我是<span>苑阳。</span></h1>
          <p className="about-lead">一名来自河北、就读于大连民族大学的大三本科生。</p>
          <p className="about-summary">
            我的主要研究兴趣围绕机械臂开发与具身智能，喜欢在机器人项目里动手落地、调试验证。
            比起停留在想法，我更享受让方案真正运行起来，并在一次次验证中把它打磨得更好。
          </p>
          <div className="about-tags" aria-label="研究兴趣">
            {focusAreas.map((area) => <span className="tag" key={area}>{area}</span>)}
          </div>
        </div>
        <figure className="portrait-frame image-reveal">
          <Image src="/images/个人01.jpg" alt="苑阳的个人照片" width={720} height={900} priority sizes="(max-width: 700px) 90vw, 360px" />
          <figcaption>苑阳 <span>· 大连民族大学</span></figcaption>
        </figure>
      </section>

      <section className="about-section robotics-section" aria-labelledby="robotics-title">
        <div className="about-section-heading">
          <span className="eyebrow">ROBOTICS · 研究与实践</span>
          <h2 id="robotics-title">把想法变成动作，在真实项目里验证。</h2>
          <p>我关注机械臂开发与具身智能，也享受从搭建、调试到验证的完整过程。每一次让系统稳定运行，都是理解机器人更进一步。</p>
        </div>
        <div className="robotics-gallery">
          <figure className="gallery-image gallery-image-main gallery-image-video image-reveal">
            <LocalVideo
              src="/video/robot-arm-01.mp4"
              title="机械臂项目实践"
              poster="/images/robot-arm.png"
            />
            <figcaption><span>01</span> 机械臂 · 项目实践</figcaption>
          </figure>
          <figure className="gallery-image gallery-image-secondary image-reveal">
            <Image src="/images/机械臂02.png" alt="机械臂调试与验证" width={900} height={1200} sizes="(max-width: 700px) 92vw, 34vw" />
            <figcaption><span>02</span> 调试 · 迭代 · 验证</figcaption>
          </figure>
        </div>
        <div className="practice-note">
          <span className="practice-mark" aria-hidden="true">↗</span>
          <p><strong>我的工作方式</strong>重视清晰的问题定义、持续迭代和可维护的实现；习惯把复杂问题拆开，一步步验证方案。</p>
        </div>
      </section>

      <section className="life-section" aria-labelledby="life-title">
        <div className="life-image image-reveal">
          <Image src="/images/life.jpg" alt="苑阳生活中的一刻" width={1200} height={900} sizes="(max-width: 700px) 92vw, 48vw" />
        </div>
        <div className="life-copy">
          <span className="eyebrow">LIFE · 日常</span>
          <h2 id="life-title">有序地生活，热情地交流。</h2>
          <p>生活里，我习惯归纳整理各类事务，偏爱整洁、有秩序的生活节奏。性格外向健谈，也乐于和不同的人交流想法、讨论技术。</p>
          <p>我相信好的灵感常常来自交流，而稳定的节奏能让热爱持续发生。</p>
          <div className="life-values"><span>保持好奇</span><span>乐于分享</span><span>持续沉淀</span></div>
        </div>
      </section>

      <section className="now-banner" aria-label="当前关注">
        <span className="eyebrow">CURRENTLY EXPLORING</span>
        <p>深耕机械臂与具身智能，持续整理机器人项目案例和技术笔记，沉淀可复盘、可复用的实践经验。</p>
      </section>
    </div>
  );
}
