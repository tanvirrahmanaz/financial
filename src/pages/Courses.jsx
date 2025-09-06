// src/pages/Courses.jsx
import { useEffect, useState } from "react";
import EnrollButton from "../components/EnrollButton.jsx";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Courses(){
  const [courses, setCourses] = useState([]);

  useEffect(()=>{
    fetch(`${API}/api/courses`)
      .then(r=>r.json())
      .then(d=>setCourses(d.courses||[]));
  },[]);

  return (
    <section id="courses" className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl font-bold mb-4">Courses</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {courses.map(c=>(
            <div key={c._id} className="border rounded-2xl bg-white p-4 flex flex-col">
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{c.description}</p>
              <EnrollButton courseId={c._id} />
            </div>
          ))}
          {courses.length===0 && <p>No courses yet.</p>}
        </div>
      </div>
    </section>
  );
}
