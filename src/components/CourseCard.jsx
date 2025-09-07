// src/components/CourseCard.jsx
import { useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const { user, authLoading } = useAuthUser();

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
    <div className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition p-4 flex flex-col">
      <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100">
        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
      </div>
      <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
      <p className="text-gray-600 text-sm flex-1">{course.description}</p>
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>{course.lessons} lessons</span>
        <span>{course.duration}</span>
      </div>
      <button
        onClick={handleEnroll}
        disabled={authLoading}
        className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-center hover:bg-indigo-700 disabled:opacity-60"
      >
        Enroll
      </button>
    </div>
  );
}
