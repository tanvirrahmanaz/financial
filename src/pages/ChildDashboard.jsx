// src/pages/ChildDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ChildDashboard() {
  const { user, authLoading } = useAuthUser();
  const [profile, setProfile] = useState(null);
  const [nextUps, setNextUps] = useState([]); // enrolled courses via progress
  const [loading, setLoading] = useState(true);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!user?.email) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const meRes = await fetch(`${API}/api/users/me?email=${encodeURIComponent(user.email)}`);
        const meData = await meRes.json();
        if (!meRes.ok) throw new Error(meData.message || "Failed to load profile");
        setProfile(meData.user);

        // if not a child, send to courses
        if (meData.user.role !== "CHILD") return;

        // load enrolled (progress-based) list only
        try{
          const pr = await fetch(`${API}/api/courses/me/progress`, { headers: { 'x-user-email': user.email }});
          const pd = await pr.json();
          if (pr.ok) {
            const items = (pd.items || []).map(it => ({
              courseId: it.courseId,
              title: it.courseTitle,
              thumbnail: it.thumbnail,
              nextIndex: it.currentLessonIndex,
              total: it.totalLessons,
              completed: it.completed,
              lastScore: it.lastScore,
              lastSubmittedAt: it.lastSubmittedAt
            }));
            setNextUps(items);
            // recent is just items sorted by lastSubmittedAt desc
            const rec = [...items].filter(i=>i.lastSubmittedAt).sort((a,b)=> new Date(b.lastSubmittedAt) - new Date(a.lastSubmittedAt));
            setRecent(rec);
          }
        }catch(_){ /* ignore */ }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, user?.email]);

  const firstName = useMemo(() => {
    if (!profile?.name) return profile?.username || user?.email?.split("@")[0] || "Friend";
    return profile.name.split(" ")[0];
  }, [profile?.name, profile?.username, user?.email]);

  if (authLoading || loading) return <div className="max-w-6xl mx-auto px-4 py-10">Loading…</div>;
  if (!user) return (
    <section className="py-12">
      <div className="max-w-md mx-auto bg-white rounded-3xl border p-6 text-center">
        Please <Link to="/login" className="text-pink-600">log in</Link> as a child account.
      </div>
    </section>
  );

  // If profile loaded and not child, reroute hint
  if (profile && profile.role !== "CHILD") {
    return (
      <section className="py-12">
        <div className="max-w-md mx-auto bg-white rounded-3xl border p-6 text-center">
          This dashboard is for children. Visit <Link to="/courses" className="text-pink-600">Courses</Link> instead.
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Greeting */}
        <div className="bg-white/90 border rounded-3xl p-6 flex items-center justify-between">
          <div>
            <h1 className="font-kids text-3xl md:text-4xl font-extrabold">Hi {firstName}! 👋</h1>
            <div className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600">
              <span className="px-3 py-1 rounded-full bg-gray-100 border">@{profile?.username || user?.email?.split("@")[0]}</span>
            </div>
            <p className="text-gray-700 mt-2">Ready to learn something fun today?</p>
          </div>
          <div className="hidden sm:block text-right">
            <div className="inline-flex items-center gap-3 bg-pink-50 text-pink-700 border border-pink-100 rounded-full px-4 py-2">
              <span>Streak</span>
              <span className="font-bold">3🔥</span>
            </div>
          </div>
        </div>

        {/* Continue learning (only enrolled) */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-kids text-2xl font-extrabold">Continue learning</h2>
            <Link to="/courses" className="px-4 py-2 rounded-full border bg-white">Browse all</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {nextUps.map((n) => {
              const pct = n.total > 0 ? Math.min(100, Math.round((n.nextIndex / n.total) * 100)) : 0;
              const label = n.completed ? "Completed" : n.total > 0 ? `Lesson ${n.nextIndex + 1} of ${n.total}` : "Start now";
              return (
                <div key={n.courseId} className="bg-white rounded-3xl border p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <h3 className="font-semibold text-lg font-kids">{n.title}</h3>
                    </div>
                    <button onClick={() => navigate(`/courses/${n.courseId}`)} className="px-4 py-2 rounded-full text-gray-800 btn-fun">
                      {n.completed ? "Review" : "Continue"}
                    </button>
                  </div>
                  {n.thumbnail && (
                    <div className="mt-3 h-28 rounded-2xl overflow-hidden border bg-gray-100">
                      <img src={n.thumbnail} alt={n.title} className="w-full h-full object-cover" />
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
                  </div>
                </div>
              );
            })}
            {nextUps.length === 0 && (
              <div className="bg-white rounded-3xl border p-6 text-gray-700">
                No enrolled courses yet. Explore and pick something fun!
              </div>
            )}
          </div>
        </div>

        {/* Recent results */}
        <div className="mt-8">
          <h2 className="font-kids text-2xl font-extrabold mb-3">Recent scores</h2>
          {recent.length === 0 ? (
            <div className="bg-white rounded-3xl border p-6 text-gray-700">No quiz results yet. Take a course to earn scores!</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-3">
              {recent.slice(0,4).map((r)=> (
                <div key={r.courseId} className="bg-white rounded-3xl border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{r.courseTitle}</p>
                    <p className="font-semibold">Last score: {r.lastScore ?? '-'} / 5</p>
                  </div>
                  <Link to={`/courses/${r.courseId}`} className="px-4 py-2 rounded-full text-gray-800 btn-fun">Open</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="mt-8">
          <h2 className="font-kids text-2xl font-extrabold mb-3">Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "🏅", name: "Starter" },
              { icon: "📚", name: "Book Buddy" },
              { icon: "🧠", name: "Quiz Whiz" },
              { icon: "🌟", name: "Super Star" },
            ].map((b) => (
              <div key={b.name} className="bg-white rounded-3xl border p-4 text-center">
                <div className="text-3xl">{b.icon}</div>
                <div className="mt-1 text-sm font-medium">{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
