export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
      {Icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)]">
          <Icon size={22} />
        </div>
      )}
      <p className="text-sm font-medium text-[var(--text)]">{title}</p>
      {description && (
        <p className="max-w-xs text-xs text-[var(--text-muted)]">{description}</p>
      )}
    </div>
  );
}
