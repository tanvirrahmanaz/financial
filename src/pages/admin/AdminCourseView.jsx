// src/pages/admin/AdminCourseView.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ADMIN_EMAIL = "admin@gmail.com";

export default function AdminCourseView(){
  const { id } = useParams();
  const { user, authLoading } = useAuthUser();
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const load = async () => {
      try{
        const r = await fetch(`${API}/api/admin/courses/${id}`, { headers: { 'x-user-email': user?.email || '' }});
        const d = await r.json();
        if(r.ok) setCourse(d.course);
        const cr = await fetch(`${API}/api/courses/${id}/comments`);
        const cd = await cr.json();
        if (cr.ok) setComments(cd.comments || []);
      } finally { setLoading(false); }
    };
    if (user?.email) load();
  }, [id, user?.email]);

  if (authLoading || loading) return <div className="max-w-6xl mx-auto px-4 py-12">Loading…</div>;
  if (!user?.email || user.email.toLowerCase() !== ADMIN_EMAIL) return <div className="max-w-6xl mx-auto px-4 py-12">Not authorized.</div>;
  if (!course) return <div className="max-w-6xl mx-auto px-4 py-12">Course not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{course.title}</h1>
        <div className="flex gap-2">
          <Link to={`/admin/courses/${id}/edit`} className="px-3 py-1 rounded-xl border">Edit</Link>
          <Link to="/admin" className="px-3 py-1 rounded-xl border">Back</Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {course.thumbnail && (
            <div className="rounded-2xl overflow-hidden border">
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover" />
            </div>
          )}
          <div className="rounded-2xl border bg-white p-4">
            <h2 className="font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{course.description || '—'}</p>
          </div>
          <div className="rounded-2xl border bg-white p-4">
            <h2 className="font-semibold mb-2">Lessons ({course.lessons?.length || 0})</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {(course.lessons || []).map((ls, i)=>(
                <li key={i} className="">
                  <div className="font-medium">{ls.title}</div>
                  <div className="text-sm text-gray-500">Quiz questions: {ls.quiz?.length || 0}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border bg-white p-4">
            <h2 className="font-semibold mb-3">Recent comments</h2>
            {comments.length === 0 ? (
              <div className="text-gray-600 text-sm">No comments yet.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-auto">
                {comments.map(c => (
                  <div key={c.id} className="border rounded-xl p-3">
                    <div className="text-xs text-gray-500">@{c.author} • {new Date(c.createdAt).toLocaleString()}</div>
                    <div className="mt-1 text-sm">{c.text}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
