// src/pages/ParentCoursePlayer.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";
import YouTube from "react-youtube";

function extractYouTubeId(input = "") {
  if (!input) return "";
  const raw = String(input).trim();
  if (/^[\w-]{6,}$/.test(raw) && !raw.includes("http")) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com")) {
      const vid = url.searchParams.get("v");
      if (vid) return vid;
    }
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "");
    }
  } catch (_) {}
  return raw;
}

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function ParentCoursePlayer(){
  const { username, courseId } = useParams();
  const [view, setView] = useState(null);
  const [error, setError] = useState("");

  useEffect(()=>{
    const u = auth.currentUser;
    if(!u?.email) return;
    (async()=>{
      setError(""); setView(null);
      try{
        const r = await fetch(`${API}/api/courses/parent/${encodeURIComponent(username)}/current/${encodeURIComponent(courseId)}`, {
          headers: { 'x-user-email': u.email }
        });
        const d = await r.json();
        if(!r.ok) throw new Error(d.message || 'Failed to load');
        setView(d);
      }catch(e){ setError(e.message); }
    })();
  }, [username, courseId]);

  if (error) return <div className="max-w-4xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if (!view) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;
  if (view.completed) return <div className="max-w-4xl mx-auto px-4 py-10">Child completed this course. Total lessons: {view.totalLessons}</div>;

  const { course, lesson, lessonIndex } = view;
  const total = course.totalLessons || 0;
  const progressPct = Math.min(100, Math.round((lessonIndex / Math.max(1, total)) * 100));

  const videoId = extractYouTubeId(lesson.youtubeId);

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600"><Link className="text-pink-600" to="/parent">Back to Parent Dashboard</Link> · Lesson {lessonIndex + 1} of {total}</p>
            <h1 className="font-kids text-2xl md:text-3xl font-extrabold">{course.title}</h1>
            <p className="text-gray-700">{lesson.title}</p>
          </div>
          <div className="hidden md:block min-w-[220px]">
            <div className="text-sm text-gray-600 text-right">Progress</div>
            <div className="h-2 w-full rounded-full bg-white/60 border overflow-hidden">
              <div className="h-2 rounded-full" style={{ width: `${progressPct}%`, backgroundImage: "linear-gradient(90deg, var(--kids-sky), var(--kids-mint))" }} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          <div className="md:col-span-2">
            <div className="relative rounded-3xl overflow-hidden border bg-black" style={{ paddingTop: '56.25%' }}>
              <div className="absolute inset-0">
                {!videoId ? (
                  <div className="w-full h-full flex items-center justify-center text-white">Video unavailable: missing YouTube ID</div>
                ) : (
                  <YouTube
                    videoId={videoId}
                    opts={{ width: '100%', height: '100%', playerVars: { rel: 0, modestbranding: 1, playsinline: 1, origin: window.location.origin } }}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                    onError={() => setError("Unable to load the YouTube video. Please check the video ID/URL.")}
                  />
                )}
              </div>
            </div>
            <div className="mt-4 bg-white rounded-3xl border p-4">
              <h2 className="font-semibold">About this lesson</h2>
              <p className="text-sm text-gray-600 mt-1">Parent view is read-only. Watching this doesn’t affect your child’s progress.</p>
            </div>
          </div>

          <div className="md:sticky md:top-24">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <h2 className="font-semibold mb-3">Quiz (read-only)</h2>
              {(lesson.quiz || []).map((q, qi)=> (
                <div key={qi} className="mb-3">
                  <p className="font-medium">{qi+1}. {q.question}</p>
                  <ul className="mt-1 space-y-1 text-sm text-gray-700">
                    {q.options.map((opt, oi)=> (
                      <li key={oi} className="flex items-center gap-2">
                        <span className="inline-block w-5 h-5 rounded-full border text-center text-xs leading-5">{String.fromCharCode(65+oi)}</span>
                        <span>{opt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="text-xs text-gray-500">Submitting is disabled in parent view.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
