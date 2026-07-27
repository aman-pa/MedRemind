import ThemeToggle from "../common/ThemeToggle";
import { Pill } from "lucide-react";

const FEATURES = [
  { title: "Smart Reminders", desc: "Never miss a dose with intelligent scheduling." },
  { title: "Doctor Connected", desc: "Prescriptions sync directly from your doctor." },
  { title: "Adherence Tracking", desc: "See your medication history at a glance." },
];

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full bg-[var(--background)]">
      <div className="hidden w-1/2 flex-col justify-between bg-[var(--surface)] p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-white">
            <Pill size={24} />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
            Med<span className="text-[var(--primary)]">Remind</span>
          </span>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-semibold leading-tight text-[var(--text)]">
            Medication management, made effortless.
          </h2>
          <div className="space-y-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 transition-colors duration-200 hover:border-[var(--primary)]/40"
              >
                <p className="text-sm font-medium text-[var(--text)]">{feature.title}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <blockquote className="text-sm text-[var(--text-muted)]">
          "MedRemind helped me stay on top of my prescriptions for the first time in years."
          <footer className="mt-1 font-medium text-[var(--text)]">— A patient, using MedRemind</footer>
        </blockquote>
      </div>

      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
              <Pill size={18} />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-[var(--text)]">
              Med<span className="text-[var(--primary)]">Remind</span>
            </span>
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-12">    
        <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}