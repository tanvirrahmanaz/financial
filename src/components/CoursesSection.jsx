// src/components/CoursesSection.jsx
import CourseCard from "./CourseCard.jsx";
import { courses } from "../data/courses.js";

export default function CoursesSection() {
  return (
    <section id="courses" className="py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Popular Courses</h2>
          <p className="text-gray-600">Handpicked lessons for fast learning</p>
        </div>
        <a href="#" className="text-indigo-600 hover:text-indigo-700">View all</a>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </section>
  );
}