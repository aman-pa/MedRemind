// Circular progress indicator, built with plain SVG so no charting
// library is required. Used for Adherence % and any other single
// "percentage complete" value.
export default function ProgressRing({
  value = 0, // 0-100
  size = 96,
  strokeWidth = 10,
  label,
  className = "",
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--primary)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="-mt-[60%] flex flex-col items-center">
        <span className="text-2xl font-bold text-[var(--text)]">{clamped}%</span>
        {label && <span className="text-xs text-[var(--text-muted)]">{label}</span>}
      </div>
    </div>
  );
}
