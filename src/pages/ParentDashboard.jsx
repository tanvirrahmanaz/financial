// src/pages/ParentDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ParentDashboard() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState({}); // username -> items (detailed)

  useEffect(() => {
    const u = auth.currentUser;
    if (!u?.email) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true); setError("");
        const res = await fetch(`${API}/api/users/me?email=${encodeURIComponent(u.email)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load profile");
        setMe(data.user);

        if (data.user.role === 'PARENT' && Array.isArray(data.user.children)) {
          // fetch detailed progress per child in parallel
          const reqs = data.user.children.map(async (c) => {
            const r = await fetch(`${API}/api/courses/parent/${encodeURIComponent(c.username)}/details`, {
              headers: { 'x-user-email': u.email }
            });
            const d = await r.json();
            return { username: c.username, ok: r.ok, items: d.items || [], error: d.message };
          });
          const all = await Promise.all(reqs);
          const map = {};
          all.forEach((it) => { map[it.username] = it.ok ? it.items : []; });
          setDetails(map);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const isParent = me?.role === 'PARENT';
  const firstName = useMemo(() => {
    if (!me?.profile?.name && !me?.name) return me?.username || me?.email?.split("@")[0] || "Parent";
    const n = me.profile?.name || me.name;
    return n.split(" ")[0];
  }, [me?.profile?.name, me?.name, me?.username, me?.email]);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading…</div>;
  if (!auth.currentUser) return (
    <section className="py-12">
      <div className="max-w-md mx-auto bg-white rounded-3xl border p-6 text-center">
        Please <Link to="/login" className="text-pink-600">log in</Link> as a parent account.
      </div>
    </section>
  );
  if (!isParent) {
    return (
      <section className="py-12">
        <div className="max-w-md mx-auto bg-white rounded-3xl border p-6 text-center">
          This dashboard is for parents. Visit <Link to="/child" className="text-pink-600">Child Dashboard</Link> instead.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white/90 border rounded-3xl p-6 flex items-center justify-between">
          <div>
            <h1 className="font-kids text-3xl md:text-4xl font-extrabold">Welcome, {firstName}! 👋</h1>
            <p className="text-gray-700">Here is your child's learning progress.</p>
          </div>
        </div>

        <div className="mt-8 space-y-8">
          {(me.children || []).length === 0 && (
            <div className="bg-white border rounded-3xl p-6 text-gray-700">
              No child linked yet. Complete your profile with your child's username.
            </div>
          )}

          {(me.children || []).map((child) => {
            const items = (details[child.username] || [])
              .slice()
              .sort((a,b) => Number(b.completed) - Number(a.completed) || new Date(b.lastSubmittedAt || 0) - new Date(a.lastSubmittedAt || 0));
            return (
              <div key={child.username} className="bg-white border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Child</p>
                    <h2 className="font-kids text-2xl font-extrabold">@{child.username} {child.name ? `— ${child.name}` : ''}</h2>
                  </div>
                </div>
                {items.length === 0 ? (
                  <div className="text-gray-700">No progress yet.</div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {items.map((n) => {
                      const pct = n.totalLessons > 0 ? Math.min(100, Math.round((n.currentLessonIndex / n.totalLessons) * 100)) : 0;
                      const label = n.completed ? "Completed" : n.totalLessons > 0 ? `Lesson ${n.currentLessonIndex + 1} of ${n.totalLessons}` : "Start now";
                      return (
                        <div key={n.courseId} className="bg-white rounded-3xl border p-5 shadow-sm">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-sm text-gray-500">Course</p>
                              <h3 className="font-semibold text-lg font-kids">{n.courseTitle}</h3>
                              {n.completed && <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Completed</span>}
                            </div>
                            <Link to={`/parent/child/${child.username}/courses/${n.courseId}`} className="px-4 py-2 rounded-full text-gray-800 btn-fun">Open</Link>
                          </div>
                          {n.thumbnail && (
                            <div className="mt-3 h-28 rounded-2xl overflow-hidden border bg-gray-100">
                              <img src={n.thumbnail} alt={n.courseTitle} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="mt-4">
                            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundImage: "linear-gradient(90deg, var(--kids-sky), var(--kids-mint))" }} />
                            </div>
                            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
                              <span>{label}</span>
                              <span className="font-medium">{pct}%</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">Watched lessons: {n.currentLessonIndex} / {n.totalLessons}</div>
                            <div className="mt-3 overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="text-left text-gray-600">
                                    <th className="py-1 pr-4">Lesson</th>
                                    <th className="py-1 pr-4">Score</th>
                                    <th className="py-1 pr-4">Submitted</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(n.results || []).map((r, i) => (
                                    <tr key={i} className="border-t">
                                      <td className="py-1 pr-4">{r.lessonIndex + 1}</td>
                                      <td className="py-1 pr-4">{r.score}/5</td>
                                      <td className="py-1 pr-4">{r.submittedAt ? new Date(r.submittedAt).toLocaleString() : '-'}</td>
                                    </tr>
                                  ))}
                                  {(!n.results || n.results.length === 0) && (
                                    <tr className="border-t"><td className="py-2 pr-4" colSpan={3}>No quiz submissions yet</td></tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
