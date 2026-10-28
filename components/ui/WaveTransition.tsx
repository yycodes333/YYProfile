const MAIN_LINES = 40;
const COUNTER_LINES = 16;

/** 主丝带：一条从左下升到右上的曲线，按 offset 生成一束近似平行的线。 */
function mainPath(offset: number) {
  return [
    `M -80 ${210 + offset}`,
    `C ${320 + offset * 0.2} ${20 + offset} ${620 - offset * 0.2} ${250 + offset} ${900 + offset * 0.2} ${120 + offset}`,
    `C ${1120 + offset * 0.2} ${20 + offset} ${1300 - offset * 0.2} ${60 + offset} ${1520 + offset * 0.2} ${40 + offset}`,
  ].join(' ');
}

/** 反向丝带：和主丝带在画面中部交叉，制造“拧”的节点。 */
function counterPath(offset: number) {
  return [
    `M -60 ${120 + offset}`,
    `C ${260 + offset * 0.2} ${250 + offset} ${480 - offset * 0.2} ${-20 + offset} ${760 + offset * 0.2} ${90 + offset}`,
    `C ${980 + offset * 0.2} ${180 + offset} ${1240 - offset * 0.2} ${240 + offset} ${1500 + offset * 0.2} ${160 + offset}`,
  ].join(' ');
}

const mainLines = Array.from({ length: MAIN_LINES }, (_, index) => ({
  key: `main-${index}`,
  d: mainPath((index - MAIN_LINES / 2) * 1.35),
  width: 0.6 + (index % 5) * 0.28,
  opacity: 0.12 + (index / MAIN_LINES) * 0.68,
}));

const counterLines = Array.from({ length: COUNTER_LINES }, (_, index) => ({
  key: `counter-${index}`,
  d: counterPath((index - COUNTER_LINES / 2) * 1.5),
  width: 0.7 + (index % 4) * 0.25,
  opacity: 0.16 + (index / COUNTER_LINES) * 0.5,
}));

/**
 * Hero 与正文之间的丝带：几十条曲线共享同一条运动轨迹，
 * 中间收紧、两端散开，再叠一层很淡的辉光。
 */
export function WaveTransition() {
  return (
    <div className="wave-band" aria-hidden="true">
      <svg viewBox="0 0 1440 240" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id="ribbon-gradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e879f9" />
            <stop offset="42%" stopColor="#8b5cf6" />
            <stop offset="78%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
          <filter id="ribbon-glow" x="-20%" y="-40%" width="140%" height="180%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <g className="ribbon-glow" filter="url(#ribbon-glow)" opacity="0.18">
          <path d={mainPath(-6)} fill="none" stroke="url(#ribbon-gradient)" strokeWidth="18" />
          <path d={mainPath(6)} fill="none" stroke="url(#ribbon-gradient)" strokeWidth="12" />
        </g>

        <g className="ribbon-lines">
          {mainLines.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke="url(#ribbon-gradient)"
              strokeWidth={line.width}
              opacity={line.opacity}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        <g className="ribbon-counter">
          {counterLines.map((line) => (
            <path
              key={line.key}
              d={line.d}
              fill="none"
              stroke="url(#ribbon-gradient)"
              strokeWidth={line.width}
              opacity={line.opacity}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
