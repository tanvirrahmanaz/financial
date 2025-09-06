// src/components/EnrollButton.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function EnrollButton({ courseId, className = "" }) {
  const { user, authLoading } = useAuthUser();
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  const handleClick = async () => {
    if (authLoading) return; // still resolving
    // not logged in → go to login (NOT signup) and remember where to return
    if (!user?.email) {
      navigate("/login", { state: { from: `/courses/${courseId}` } });
      return;
    }

    // logged-in → make sure profile is complete
    try {
      setChecking(true);
      const res = await fetch(
        `${API}/api/users/me?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Profile check failed");

      if (!data.user?.profileComplete) {
        navigate("/complete-profile", { state: { from: `/courses/${courseId}` } });
        return;
      }

      // OK → go to player
      navigate(`/courses/${courseId}`);
    } catch (e) {
      // fallback: let user complete profile
      navigate("/complete-profile", { state: { from: `/courses/${courseId}` } });
    } finally {
      setChecking(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={authLoading || checking}
      className={
        className ||
        "mt-4 ml-auto px-3 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-60"
      }
    >
      {authLoading || checking ? "Please wait…" : "Enroll / Start"}
    </button>
  );
}
