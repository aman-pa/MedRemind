
export default function Avatar({ name = "", src = "", size = "md", className = "" }) {
  const getInitials = (fullName) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const sizes = {
    sm: "h-8 w-8 text-xs font-semibold",
    md: "h-10 w-10 text-sm font-semibold",
    lg: "h-16 w-16 text-xl font-bold",
  };

  return (
    <div className={`relative flex shrink-0 items-center justify-center rounded-full overflow-hidden border border-[var(--border)] bg-[var(--bg-soft)] text-[var(--text)] ${sizes[size]} ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <span className="text-[var(--primary)] select-none">{getInitials(name)}</span>
      )}
    </div>
  );
}
