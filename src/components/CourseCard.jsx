// src/components/CourseCard.jsx
import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
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
      <Link to="/signup" className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-center hover:bg-indigo-700">Enroll</Link>
    </div>
  );
}