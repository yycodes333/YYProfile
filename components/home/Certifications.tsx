import Image from 'next/image';
import { Reveal } from '@/components/motion/Reveal';
import { certifications } from '@/lib/content/certifications';

/** 证书陈列：三张占位卡，后续只替换内容数据。 */
export function Certifications() {
  return (
    <Reveal as="section" id="certs" className="section certs-section" aria-labelledby="certs-title">
      <h2 id="certs-title" className="section-title" data-scroll-fade>
        <a href="#certs">证书</a>
      </h2>
      <p className="lead" data-scroll-fade>竞赛与专业认证。</p>

      <ul className="cert-grid">
        {certifications.map((cert) => (
          <li className="cert-card" key={cert.id} data-scroll-fade>
            <span className="cert-badge">
              <Image
                src={cert.image.src}
                alt={cert.image.alt}
                width={cert.image.width}
                height={cert.image.height}
              />
            </span>
            <span className="cert-body">
              <span className="cert-title">{cert.title}</span>
              <span className="cert-meta">
                {cert.issuer} · <time dateTime={cert.dateTime}>{cert.date}</time>
              </span>
            </span>
            <a
              className="cert-pdf"
              href={cert.pdf}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`查看证书 PDF：${cert.title}`}
            >
              PDF
            </a>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
