import { BarChart3, AlertTriangle } from "lucide-react";
import EmptyState from "../common/EmptyState";

// Per Analytics_Frontend_Context.md: "No analytics available yet." is an
// EXPECTED state (no medication logs yet), not an error state.
export default function EmptyAnalytics({ className = "" }) {
  return (
    <EmptyState
      icon={BarChart3}
      title="No analytics available yet."
      description="Once you start logging medicine activity, your insights will show up here."
      className={className}
    />
  );
}

// Distinct from the empty state: this means the request itself failed
// (network/server error), not "no data yet". Offers a retry.
export function ErrorAnalytics({ onRetry, className = "" }) {
  return (
    <EmptyState
      icon={AlertTriangle}
      title="Couldn't load analytics."
      description="Something went wrong while fetching your data. Please try again."
      actionLabel={onRetry ? "Retry" : undefined}
      onAction={onRetry}
      className={`border-red-500/30 ${className}`}
    />
  );
}
