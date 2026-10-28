type CoverTone = 'warm' | 'ink' | 'violet';

type CoverBlockProps = {
  title: string;
  subtitle?: string;
  tone?: CoverTone;
  className?: string;
};

export function CoverBlock({
  title,
  subtitle,
  tone = 'warm',
  className = '',
}: CoverBlockProps) {
  return (
    <figure className={`cover-block ${className}`.trim()} data-tone={tone}>
      <figcaption>
        {title}
        {subtitle ? <span>{subtitle}</span> : null}
      </figcaption>
    </figure>
  );
}
