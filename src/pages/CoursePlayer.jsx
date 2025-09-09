// src/pages/CoursePlayer.jsx — CLEANED (single auth check, same behavior)
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import YouTube from "react-youtube";

function extractYouTubeId(input = "") {
  if (!input) return "";
  const raw = String(input).trim();
  if (/^[\w-]{6,}$/.test(raw) && !raw.includes("http")) return raw; // already an ID
  try {
    const url = new URL(raw);
    if (url.hostname.includes("youtube.com")) {
      const vid = url.searchParams.get("v");
      if (vid) return vid;
    }
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace(/^\//, "");
    }
  } catch (_) { /* not a URL */ }
  return raw;
}
import useAuthUser from "../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CoursePlayer(){
  const { id } = useParams();
  const { user, authLoading } = useAuthUser();
  const navigate = useNavigate();
  const [view, setView] = useState(null);
  const [answers, setAnswers] = useState([null,null,null,null,null]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const loadCurrent = async ()=>{
    setError("");
    const res = await fetch(`${API}/api/courses/${id}/current`, {
      headers: { "x-user-email": user?.email || "" }
    });
    const data = await res.json();
    if(!res.ok){ setError(data.message || "Failed to load"); return; }
    setView(data); setAnswers([null,null,null,null,null]); setResult(null); setVideoEnded(false);
  };

  useEffect(()=>{ if(user?.email) loadCurrent(); }, [id, user?.email]);

  const loadComments = async () => {
    try {
      const r = await fetch(`${API}/api/courses/${id}/comments`);
      const d = await r.json();
      if (r.ok) setComments(d.comments || []);
    } catch {}
  };
  useEffect(()=>{ loadComments(); }, [id]);

  const setChoice = (qi, idx)=>{
    const next = [...answers]; next[qi] = idx; setAnswers(next);
  };

  const submitQuiz = async ()=>{
    setSubmitting(true); setError("");
    try{
      const payload = { lessonIndex: view.lessonIndex, answers: answers.map(a=>Number(a)) };
      if(payload.answers.some(a=>Number.isNaN(a))) throw new Error("Select all answers");

      const res = await fetch(`${API}/api/courses/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type":"application/json", "x-user-email": user?.email || "" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || "Submit failed");
      setResult(data);
    }catch(e){ setError(e.message);} finally { setSubmitting(false); }
  };

  const goNext = ()=> loadCurrent();

  const canComment = useMemo(()=> Boolean(view?.completed && user?.email), [view?.completed, user?.email]);
  const submitComment = async ()=>{
    const text = newComment.trim();
    if (!text) return;
    try{
      const r = await fetch(`${API}/api/courses/${id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': user?.email || '' },
        body: JSON.stringify({ text })
      });
      const d = await r.json();
      if (r.ok) {
        setNewComment("");
        loadComments();
      } else {
        setError(d.message || 'Failed to post comment');
      }
    } catch(e){ setError('Failed to post comment'); }
  };

  // ——— RENDER GUARDS ———
  if (authLoading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;
  if (!user) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      Please <Link className="text-indigo-600 underline" to="/login">log in</Link> with a child account to access this course.
    </div>
  );

  if(error) return <div className="max-w-4xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if(!view) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;
  if(view.completed) return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="rounded-3xl border bg-white p-6 text-center">
          <div className="text-2xl">🎉 Course completed!</div>
          <p className="text-gray-700 mt-1">Total lessons: {view.totalLessons}</p>
        </div>
        {/* Comments */}
        <div className="mt-6 rounded-3xl border bg-white p-5">
          <h2 className="font-semibold mb-3">Comments</h2>
          {comments.length === 0 ? (
            <p className="text-gray-600 text-sm">No comments yet. Be the first!</p>
          ) : (
            <div className="space-y-3">
              {comments.map(c => (
                <div key={c.id} className="border rounded-2xl p-3">
                  <div className="text-sm text-gray-500">@{c.author} • {new Date(c.createdAt).toLocaleString()}</div>
                  <div className="mt-1">{c.text}</div>
                </div>
              ))}
            </div>
          )}
          {canComment && (
            <div className="mt-4">
              <textarea value={newComment} onChange={e=>setNewComment(e.target.value)} className="w-full border rounded-xl px-3 py-2" rows={3} placeholder="Write a comment (max 500 chars)" />
              <button onClick={submitComment} className="mt-2 px-4 py-2 rounded-full text-gray-800 btn-fun">Post comment</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const { course, lesson, lessonIndex } = view;
  const total = course.totalLessons || 0;
  const progressPct = Math.min(100, Math.round((lessonIndex / Math.max(1, total)) * 100));

  const videoId = extractYouTubeId(lesson.youtubeId);

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header / breadcrumbs */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-600"><Link className="text-pink-600" to="/courses">Courses</Link> · Lesson {lessonIndex + 1} of {total}</p>
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

        {/* Layout: video left, quiz right (stack on mobile) */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Video and details */}
          <div className="md:col-span-2">
            <div className="relative rounded-3xl overflow-hidden border bg-black" style={{ paddingTop: '56.25%' }}>
              <div className="absolute inset-0">
                {!videoId ? (
                  <div className="w-full h-full flex items-center justify-center text-white">Video unavailable: missing YouTube ID</div>
                ) : (
                <YouTube
                  videoId={videoId}
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: { rel: 0, modestbranding: 1, playsinline: 1, origin: window.location.origin }
                  }}
                  className="w-full h-full"
                  iframeClassName="w-full h-full"
                  onEnd={() => setVideoEnded(true)}
                  onError={() => setError("Unable to load the YouTube video. Please check the video ID/URL.")}
                  onStateChange={(e) => { if (e?.data === 0) setVideoEnded(true); }}
                />)}
              </div>
            </div>
            <div className="mt-4 bg-white rounded-3xl border p-4">
              <h2 className="font-semibold">About this lesson</h2>
              <p className="text-sm text-gray-600 mt-1">Watch the video, then answer the 5 quiz questions on the right.</p>
            </div>
          </div>

          {/* Sidebar card: gate quiz until video end, then show Next */}
          <div className="md:sticky md:top-24">
            <div className="rounded-3xl border bg-white p-4 shadow-sm">
              <h2 className="font-semibold mb-3">Next step</h2>
              {!videoEnded && (
                <div className="mb-3 text-sm text-gray-600 bg-amber-50 border border-amber-100 rounded-xl p-3">
                  Please watch the full video to unlock the quiz.
                </div>
              )}
              <button
                onClick={()=> navigate(`/courses/${id}/quiz`)}
                disabled={!videoEnded}
                className="w-full px-4 py-2 rounded-full text-gray-800 btn-fun disabled:opacity-60"
              >
                Go to Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
