import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordInput({ label, id, error, registration = {}, ...props }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--text)]">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full rounded-lg border bg-[var(--surface)] px-3 py-2.5 pr-10 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
          error ? "border-[var(--danger)]" : "border-[var(--border)] hover:border-[var(--primary)]/50"
          }`}
          {...registration}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--primary)]"        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-[var(--danger)]">
          {error}
        </p>
      )}
    </div>
  );
}