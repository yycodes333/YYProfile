type IconProps = {
  className?: string;
};

/** GitHub 瀹樻柟 octocat mark 鐨勮矾寰勩€?*/
export function GithubIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.4-3.88-1.4-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.21.66.79.55A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

/** B 绔欏皬鐢佃鐨勭畝鍖栫嚎绋匡細鍦嗚鏈鸿韩 + 澶╃嚎 + 涓や釜鐪肩潧銆?*/
export function BilibiliIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <rect x="2.5" y="7.5" width="19" height="12.5" rx="4" />
      <path d="M7.4 3.6 10 6.9M16.6 3.6 14 6.9" />
      <circle cx="9" cy="13.4" r="1.15" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13.4" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
