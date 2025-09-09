// src/pages/Courses.jsx
import { useEffect, useMemo, useState } from "react";
import EnrollButton from "../components/EnrollButton.jsx";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function Courses(){
  const [courses, setCourses] = useState([]);
  const [q, setQ] = useState("");

  useEffect(()=>{
    fetch(`${API}/api/courses`)
      .then(r=>r.json())
      .then(d=>setCourses(d.courses||[]));
  },[]);

  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase();
    if(!term) return courses;
    return courses.filter(c => (c.title||"").toLowerCase().includes(term) || (c.description||"").toLowerCase().includes(term));
  }, [q, courses]);

  const isNew = (iso) => {
    if(!iso) return false;
    const created = new Date(iso).getTime();
    return Date.now() - created < 1000*60*60*24*7; // 7 days
  };

  return (
    <section id="courses" className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="font-kids text-3xl font-extrabold">All Courses</h2>
          <div className="flex items-center gap-2">
            <input
              value={q}
              onChange={(e)=>setQ(e.target.value)}
              placeholder="Search courses…"
              className="px-3 py-2 rounded-full border bg-white/80 w-56"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map(c=>{
            const thumb = c.thumbnail || c.thumbnailUrl || c.thumbnailURL || c.image || c.cover;
            return (
            <div key={c._id} className="border rounded-3xl bg-white p-4 flex flex-col shadow-sm relative overflow-hidden">
              {isNew(c.createdAt) && (
                <span className="absolute top-3 right-3 text-xs bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">New</span>
              )}
              {thumb ? (
                <div className="h-28 mb-3 rounded-2xl overflow-hidden border bg-gray-100">
                  <img src={thumb} alt={c.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-28 mb-3 rounded-2xl bg-gradient-to-br from-sky-100 via-pink-100 to-amber-100 flex items-center justify-center text-4xl">📘</div>
              )}
              <h3 className="font-semibold font-kids">{c.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3 flex-1">{c.description}</p>
              <EnrollButton courseId={c._id} />
            </div>
          );})}
          {filtered.length===0 && <p>No courses found.</p>}
        </div>
      </div>
    </section>
  );
}
