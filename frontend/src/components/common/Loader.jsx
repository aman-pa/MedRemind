export default function Loader({ size = "md", className = "" }) {
  const sizeMap = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-[3px]",
  };

  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-[var(--border)] border-t-[var(--primary)] ${sizeMap[size]} ${className}`}
    />
  );
}