import { useState } from "react";
import SearchBar from "./SearchBar";
import Button from "../common/Button";
import { UserPlus, AlertCircle, CheckCircle } from "lucide-react";

export default function SearchPatient({
  onSendRequest,
  label = "Search Patient by Email",
  placeholder = "patient@example.com",
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) return;

    setLoading(true);
    setFeedback({ type: null, message: "" });

    try {
      const response = await onSendRequest(email.trim());
      setFeedback({
        type: "success",
        message: response.message || "Connection request sent successfully.",
      });
      setEmail(""); // Clear input on success
    } catch (err) {
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to send connection request.";
      setFeedback({
        type: "error",
        message: errMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="search-email" className="text-sm font-medium text-[var(--text)]">
          {label}
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar
            value={email}
            onChange={(val) => {
              setEmail(val);
              if (feedback.type) setFeedback({ type: null, message: "" });
            }}
            placeholder={placeholder}
            onClear={() => {
              setEmail("");
              setFeedback({ type: null, message: "" });
            }}
            className="flex-1"
          />
          <Button
            type="submit"
            isLoading={loading}
            disabled={!email || !email.trim()}
            className="w-full sm:w-auto py-2.5 px-5 text-sm"
          >
            <UserPlus className="h-4 w-4" /> Send Request
          </Button>
        </div>
      </div>

      {feedback.type === "success" && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs font-medium text-[var(--success)] border border-emerald-500/20">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}

      {feedback.type === "error" && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-xs font-medium text-[var(--danger)] border border-red-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{feedback.message}</span>
        </div>
      )}
    </form>
  );
}
