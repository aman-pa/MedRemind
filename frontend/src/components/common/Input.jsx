export default function Input({ label, id, error, type = "text", registration = {}, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
       className={`w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
  error
    ? "border-[var(--danger)]"
    : "border-[var(--border)] hover:border-[var(--primary)]/50"
}`}

        {...registration}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}