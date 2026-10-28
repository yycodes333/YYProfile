import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container page-shell">
      <span className="eyebrow">404</span>
      <h1>页面不存在或已移动</h1>
      <p className="lead">你访问的地址可能写错了，或内容尚未发布。</p>
      <div className="actions">
        <Link className="button" href="/">
          返回首页
        </Link>
        <Link className="button secondary" href="/#work">
          浏览作品
        </Link>
      </div>
    </div>
  );
}
