// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useAuthUser from "../../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ADMIN_EMAIL = "admin@gmail.com";

export default function AdminDashboard(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [busy, setBusy] = useState(false);
  const { user: me, authLoading } = useAuthUser();
  const [recentComments, setRecentComments] = useState([]);

  useEffect(()=>{
    const run = async ()=>{
      try{
        const [ur, cr] = await Promise.all([
          fetch(`${API}/api/admin/users`, { headers: { "x-user-email": me?.email || "" } }),
          fetch(`${API}/api/admin/courses`, { headers: { "x-user-email": me?.email || "" } })
        ]);
        const ud = await ur.json();
        const cd = await cr.json();
        if(ur.ok) setUsers(ud.users || []);
        if(cr.ok) setCourses(cd.courses || []);
        // recent comments
        const rr = await fetch(`${API}/api/admin/comments?limit=20`, { headers: { 'x-user-email': me?.email || '' } });
        const rd = await rr.json();
        if (rr.ok) setRecentComments(rd.comments || []);
      } finally { setLoading(false); }
    };
    if(me?.email && me.email.toLowerCase() === ADMIN_EMAIL) run();
  },[me?.email]);

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;
    setBusy(true);
    try{
      const r = await fetch(`${API}/api/admin/courses/${id}`, { method: 'DELETE', headers: { 'x-user-email': me?.email || '' } });
      if (r.ok) setCourses(prev => prev.filter(c => c._id !== id));
    } finally { setBusy(false); }
  };

  const isAdmin = useMemo(()=> me?.email && me.email.toLowerCase() === ADMIN_EMAIL, [me?.email]);

  if (authLoading || loading) return <div className="max-w-6xl mx-auto px-4 py-12">Loading…</div>;
  if (!isAdmin) return <div className="max-w-6xl mx-auto px-4 py-12">Not authorized.</div>;

  const totalUsers = users.length;
  const totalParents = users.filter(u=>u.role === 'PARENT').length;
  const totalChildren = users.filter(u=>u.role === 'CHILD').length;
  const totalCourses = courses.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/courses/new" className="px-4 py-2 rounded-xl bg-indigo-600 text-white">New Course</Link>
      </div>

      {/* Summary boxes */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-2xl border bg-white p-4 text-center">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-bold">{totalUsers}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <div className="text-sm text-gray-500">Parents</div>
          <div className="text-2xl font-bold">{totalParents}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <div className="text-sm text-gray-500">Children</div>
          <div className="text-2xl font-bold">{totalChildren}</div>
        </div>
        <div className="rounded-2xl border bg-white p-4 text-center">
          <div className="text-sm text-gray-500">Courses</div>
          <div className="text-2xl font-bold">{totalCourses}</div>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Courses ({courses.length})</h2>
        </div>
        {courses.length === 0 ? (
          <p className="text-gray-600">No courses yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map(c => (
              <div key={c._id} className="border rounded-2xl p-4 bg-white flex flex-col">
                {c.thumbnail && (
                  <div className="h-28 rounded-xl overflow-hidden border bg-gray-100 mb-3">
                    <img src={c.thumbnail} alt={c.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-semibold">{c.title}</h3>
                <p className="text-sm text-gray-600 mt-1">Lessons: {c.lessons?.length || 0}</p>
                <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Link to={`/admin/courses/${c._id}`} className="px-3 py-1 rounded-full border">View</Link>
                  <Link to={`/admin/courses/${c._id}/edit`} className="px-3 py-1 rounded-full border">Edit</Link>
                  <button disabled={busy} onClick={()=>deleteCourse(c._id)} className="px-3 py-1 rounded-full border text-red-600 hover:bg-red-50 disabled:opacity-60">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h2 className="font-semibold mb-3">All Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Relations</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u=> {
                  const rel = u.role === 'PARENT'
                    ? (u.children || []).map(c=> `@${c.username}`).join(', ') || '-'
                    : (u.parent ? `parent: @${u.parent.username}` : '-');
                  return (
                    <tr key={u._id} className="border-t">
                      <td className="py-2 pr-4">{u.name || u.profile?.name || "-"}</td>
                      <td className="py-2 pr-4">{u.email || "-"}</td>
                      <td className="py-2 pr-4">{u.role}</td>
                      <td className="py-2 pr-4">{u.username || "-"}</td>
                      <td className="py-2 pr-4">{rel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-4 mt-6">
        <h2 className="font-semibold mb-3">Recent Comments</h2>
        {recentComments.length === 0 ? (
          <p className="text-gray-600">No comments yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-3">
            {recentComments.map(c => (
              <div key={c.id} className="border rounded-2xl p-4">
                <div className="text-xs text-gray-500">@{c.author} ({c.role?.toLowerCase?.() || 'user'}) • {new Date(c.createdAt).toLocaleString()}</div>
                <div className="text-sm mt-1 line-clamp-3">{c.text}</div>
                <Link to={`/admin/courses/${c.courseId}`} className="mt-2 inline-block text-xs px-3 py-1 rounded-full border">Open {c.courseTitle}</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
