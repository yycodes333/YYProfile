import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '技能与荣誉',
  description: '苑阳的机器人与具身智能实践、编程基础、专业课程及竞赛荣誉。',
};

const groups = [
  {
    number: '01',
    title: '机器人与具身智能',
    summary: '面向机器人系统开发与视觉感知的核心实践方向。',
    skills: ['ROS / ROS 2', 'MoveIt 2', 'OpenCV', 'Linux'],
  },
  {
    number: '02',
    title: '编程与数据处理',
    summary: '覆盖算法实现、数据分析与工程开发所需的语言基础。',
    skills: ['C++', 'Python', 'C', 'Java', 'NumPy', 'MySQL'],
  },
  {
    number: '03',
    title: 'Web 基础',
    summary: '能够使用基础 Web 技术构建与呈现页面。',
    skills: ['HTML', 'CSS'],
  },
];

const courses = [
  '高等数学', '线性代数', '数据结构与算法', '机器人运动学', '数字电路', '模拟电子技术',
];

export default function SkillsPage() {
  return (
    <div className="container skills-page">
      <header className="skills-hero">
        <span className="eyebrow">SKILLS · ROBOTICS & AI</span>
        <h1>从代码到机器人，<br /><span>让系统真正动起来。</span></h1>
        <p>以机器人与具身智能为主线，结合编程、视觉和工程基础开展学习与项目实践。</p>
        <Link className="text-link" href="/projects">查看相关项目 <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="skills-section" aria-labelledby="technical-skills-title">
        <div className="skills-section-heading">
          <div><span className="eyebrow">TECHNICAL TOOLKIT</span><h2 id="technical-skills-title">技术能力</h2></div>
          <p>按实际应用领域整理，避免把工具名称和专业方向混为一谈。</p>
        </div>
        <div className="skills-grid">
          {groups.map((group) => (
            <article className="skill-card" key={group.number}>
              <span className="skill-number">{group.number}</span>
              <h3>{group.title}</h3>
              <p>{group.summary}</p>
              <ul className="skill-tags" aria-label={`${group.title}技能`}>
                {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="skills-section study-section" aria-labelledby="courses-title">
        <div className="skills-section-heading">
          <div><span className="eyebrow">ACADEMIC FOUNDATION</span><h2 id="courses-title">专业课程</h2></div>
          <p>数学、算法、机器人与电子技术共同构成专业学习基础。</p>
        </div>
        <ul className="course-list">
          {courses.map((course, index) => <li key={course}><span>0{index + 1}</span>{course}</li>)}
        </ul>
      </section>

      <section className="honors-panel" aria-labelledby="honors-title">
        <div className="honors-heading"><span className="eyebrow">RECOGNITION</span><h2 id="honors-title">以持续投入，交出阶段成果。</h2></div>
        <div className="honors-list">
          <article><strong className="honor-count">02<span>年</span></strong><div><h3>国家奖学金</h3><p>连续两年获得国家奖学金</p></div></article>
          <article><strong className="honor-count">01<span>等奖</span></strong><div><h3>中国机器人及人工智能大赛</h3><p>国家级一等奖</p></div></article>
        </div>
      </section>
    </div>
  );
}
