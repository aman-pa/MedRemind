import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { User } from "lucide-react";

export default function ProfileAvatar() {
  const { user } = useContext(AuthContext);

  return (
    <Link
      to="/doctor/profile"
      className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] transition-transform hover:scale-105"
    >
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="h-full w-full object-cover"
        />
      ) : (
        <User size={20} />
      )}
    </Link>
  );
}
