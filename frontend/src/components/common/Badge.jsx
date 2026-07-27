
export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[var(--surface-strong)] text-[var(--text-muted)]",
    primary: "bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary)]/20",
    success: "bg-emerald-500/10 text-[var(--success)] border border-emerald-500/20",
    warning: "bg-amber-500/10 text-[var(--warning)] border border-amber-500/20",
    danger: "bg-red-500/10 text-[var(--danger)] border border-red-500/20",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium tracking-wide transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
