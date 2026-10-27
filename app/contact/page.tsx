import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/ContactForm';
import { siteConfig } from '@/lib/constants';

export const metadata: Metadata = {
  title: '联系我',
  description: '联系苑阳：邮件、B 站主页与其他愿意公开的联系入口。',
};

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  const mailtoHref = email
    ? `mailto:${email}?subject=${encodeURIComponent('来自个人网站的联络')}`
    : '';

  return (
    <div className="container contact-page">
      <div className="contact-top">
        <h1>一起合作吧</h1>
        <a className="button contact-say-hello" href="#contact-form">
          打个招呼
        </a>
      </div>

      <p className="contact-lead">
        我一直活跃在自己的社交媒体主页。如果你想在即将开展的项目、技术讨论或任何合作提案上与我共事，欢迎随时联系我。
      </p>

      <ContactForm />

      <section className="contact-channels" aria-labelledby="contact-channels-title">
        <h2 id="contact-channels-title">其他联系方式</h2>
        <ul className="contact-links">
          {mailtoHref ? (
            <li>
              <a className="contact-link-card" href={mailtoHref}>
                <span className="contact-link-label">邮件联系</span>
                <strong>{email}</strong>
              </a>
            </li>
          ) : null}
          {siteConfig.socialLinks.map((social) => (
            <li key={social.href}>
              <a
                className="contact-link-card"
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="contact-link-label">{social.label}（外部链接）</span>
                <strong>{social.handle}</strong>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
