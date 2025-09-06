// src/pages/CoursePlayer.jsx — CLEANED (single auth check, same behavior)
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import YouTube from "react-youtube";
import useAuthUser from "../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CoursePlayer(){
  const { id } = useParams();
  const { user, authLoading } = useAuthUser();
  const [view, setView] = useState(null);
  const [answers, setAnswers] = useState([null,null,null,null,null]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const loadCurrent = async ()=>{
    setError("");
    const res = await fetch(`${API}/api/courses/${id}/current`, {
      headers: { "x-user-email": user?.email || "" }
    });
    const data = await res.json();
    if(!res.ok){ setError(data.message || "Failed to load"); return; }
    setView(data); setAnswers([null,null,null,null,null]); setResult(null);
  };

  useEffect(()=>{ if(user?.email) loadCurrent(); }, [id, user?.email]);

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

  // ——— RENDER GUARDS ———
  if (authLoading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;
  if (!user) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      Please <Link className="text-indigo-600 underline" to="/login">log in</Link> with a child account to access this course.
    </div>
  );

  if(error) return <div className="max-w-4xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if(!view) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;
  if(view.completed) return <div className="max-w-4xl mx-auto px-4 py-10">🎉 Course completed! Total lessons: {view.totalLessons}</div>;

  const { course, lesson, lessonIndex } = view;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p className="text-gray-600 mb-4">Lesson {lessonIndex+1} / {course.totalLessons}: {lesson.title}</p>

      <div className="aspect-video rounded-xl overflow-hidden border bg-black">
        <YouTube videoId={lesson.youtubeId} opts={{ width:"100%", height:"100%" }} />
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-4">
        <h2 className="font-semibold mb-3">Quiz (5 questions)</h2>
        {lesson.quiz.map((q, qi)=>(
          <div key={qi} className="mb-4">
            <p className="font-medium mb-2">{qi+1}. {q.question}</p>
            <div className="grid sm:grid-cols-2 gap-2">
              {q.options.map((opt, oi)=>(
                <label key={oi} className={`border rounded-xl px-3 py-2 cursor-pointer ${answers[qi]===oi?'border-indigo-600 ring-1 ring-indigo-200':''}`}>
                  <input type="radio" name={`q${qi}`} className="mr-2" checked={answers[qi]===oi} onChange={()=>setChoice(qi, oi)} />
                  {String.fromCharCode(65+oi)}. {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
        {!result ? (
          <button onClick={submitQuiz} disabled={submitting} className="px-4 py-2 rounded-xl bg-indigo-600 text-white">
            {submitting? "Submitting..." : "Submit quiz"}
          </button>
        ) : (
          <div className="mt-4">
            <p className="font-semibold">Score: {result.score} / 5</p>
            <p className="text-sm text-gray-600">Correct answers: {result.correctAnswers.map(i=>String.fromCharCode(65+i)).join(", ")}</p>
            <button onClick={goNext} className="mt-3 px-4 py-2 rounded-xl bg-green-600 text-white">
              {result.next.completed ? "Finish course" : "Go to next lesson"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
