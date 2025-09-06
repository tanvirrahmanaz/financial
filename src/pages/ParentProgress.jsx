// src/pages/ParentProgress.jsx
import { useState } from "react";
import { auth } from "../firebase/firebase.config.js";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ParentProgress(){
  const [childUsername, setChildUsername] = useState("");
  const [courseId, setCourseId] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const fetchProgress = async ()=>{
    setErr(""); setData(null);
    const res = await fetch(`${API}/api/courses/parent/progress/${encodeURIComponent(childUsername)}/${encodeURIComponent(courseId)}`, {
      headers: { "x-user-email": auth.currentUser?.email || "" }
    });
    const d = await res.json();
    if(!res.ok) { setErr(d.message || "Failed"); return; }
    setData(d);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Child Progress</h1>
      <div className="grid md:grid-cols-3 gap-3 bg-white border rounded-2xl p-4">
        <input className="border rounded-xl px-3 py-2" placeholder="Child username" value={childUsername} onChange={e=>setChildUsername(e.target.value)} />
        <input className="border rounded-xl px-3 py-2" placeholder="Course ID" value={courseId} onChange={e=>setCourseId(e.target.value)} />
        <button onClick={fetchProgress} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">View</button>
      </div>
      {err && <p className="text-red-600 mt-3">{err}</p>}
      {data && (
        <div className="mt-6 rounded-2xl border bg-white p-4">
          <h2 className="font-semibold">{data.course?.title || "Course"}</h2>
          {!data.hasProgress ? (
            <p className="text-gray-600 mt-2">No progress yet.</p>
          ) : (
            <>
              <p className="text-gray-700 mt-2">Current lesson index: {data.currentLessonIndex} / {data.course.totalLessons}</p>
              <p className="text-gray-700 mb-3">Completed: {data.completed ? "Yes" : "No"}</p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-4">Lesson</th>
                      <th className="py-2 pr-4">Score</th>
                      <th className="py-2 pr-4">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.results?.map((r,i)=>(
                      <tr key={i} className="border-t">
                        <td className="py-2 pr-4">{r.lessonIndex+1}</td>
                        <td className="py-2 pr-4">{r.score}/5</td>
                        <td className="py-2 pr-4">{new Date(r.submittedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
