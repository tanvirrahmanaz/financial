// src/components/CoursesSection.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard.jsx";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CoursesSection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API}/api/courses`);
        const d = await r.json();
        if (!cancelled && r.ok) {
          // show latest 6
          setItems((d.courses || []).slice(0, 6));
        }
      } catch (_) {
        // ignore; keep empty
      }
    })();
    return () => { cancelled = true; };
  }, []);
  return (
    <section id="courses" className="py-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="font-kids text-3xl md:text-4xl font-extrabold text-gray-900">Popular Courses</h2>
          <p className="text-gray-600">Handpicked lessons for fast learning</p>
        </div>
        <Link to="/courses" className="px-4 py-2 rounded-full border bg-white/70 hover:bg-white text-gray-800">View all</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((c) => (
          <CourseCard key={c._id || c.id} course={c} />
        ))}
        {items.length === 0 && (
          <div className="text-gray-600">No courses found yet.</div>
        )}
      </div>
    </section>
  );
}
