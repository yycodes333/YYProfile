import { BilibiliIcon, GithubIcon } from '@/components/ui/BrandIcons';
import { siteConfig } from '@/lib/constants';

const ICONS: Record<string, React.ReactNode> = {
  GitHub: <GithubIcon />,
  bilibili: <BilibiliIcon />,
};

type SocialLinksProps = {
  className?: string;
  /** 图标前的分组说明，供读屏区分「社交入口」与主导航 */
  label?: string;
};

/** 只渲染站点配置里明确公开的渠道；图标按钮带 44px 触控区与可读名称。 */
export function SocialLinks({ className, label = '社交主页' }: SocialLinksProps) {
  const links = siteConfig.socialLinks.filter((link) => ICONS[link.label]);
  if (links.length === 0) return null;

  return (
    <ul className={className ? `social-links ${className}` : 'social-links'} aria-label={label}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${link.label}：${link.handle}（外部链接）`}
            title={link.label}
          >
            {ICONS[link.label]}
          </a>
        </li>
      ))}
    </ul>
  );
}
