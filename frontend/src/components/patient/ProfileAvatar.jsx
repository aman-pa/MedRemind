import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

// Clicking the avatar takes the patient to their Profile page.
export default function ProfileAvatar() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/patient/profile")}
      aria-label="Open profile"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary-light)] text-[var(--primary)] hover:opacity-90"
    >
      <User size={17} />
    </button>
  );
}
