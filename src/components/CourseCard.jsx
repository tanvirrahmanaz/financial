// src/components/CourseCard.jsx
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { user, authLoading } = useAuthUser();
  const thumb = course.thumbnail || course.thumbnailUrl || course.thumbnailURL || course.image || course.cover;

  const handleEnroll = () => {
    if (authLoading) return;
    if (user?.email) {
      // User is logged in → take them to real courses list to pick a course
      navigate("/courses");
    } else {
      // Not logged in → go to login (not signup)
      navigate("/login", { state: { from: "/courses" } });
    }
  };
  return (
    <div className="rounded-3xl border bg-white shadow-sm hover:shadow-md hover:scale-[1.01] transition p-4 flex flex-col">
      {thumb ? (
        <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
          <img src={thumb} alt={course.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-gradient-to-br from-sky-100 via-pink-100 to-amber-100 flex items-center justify-center text-4xl">📘</div>
      )}
      <h3 className="font-semibold text-lg mb-1 font-kids">{course.title}</h3>
      <p className="text-gray-600 text-sm flex-1">{course.description}</p>
      {/* Optional meta; show only when available (demo data) */}
      {(course.lessons || course.duration) && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>{course.lessons ? `${course.lessons} lessons` : ''}</span>
          <span>{course.duration || ''}</span>
        </div>
      )}
      <button
        onClick={handleEnroll}
        disabled={authLoading}
        className="mt-4 px-4 py-2 rounded-full text-gray-800 text-center btn-fun disabled:opacity-60"
      >
        Enroll
      </button>
    </div>
  );
}
