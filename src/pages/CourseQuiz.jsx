// src/pages/CourseQuiz.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CourseQuiz(){
  const { id } = useParams();
  const { user, authLoading } = useAuthUser();
  const [view, setView] = useState(null); // from /current
  const [answers, setAnswers] = useState([null,null,null,null,null]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    if(!user?.email) return; 
    (async()=>{
      setError("");
      try{
        const r = await fetch(`${API}/api/courses/${id}/current`, { headers: { 'x-user-email': user.email }});
        const d = await r.json();
        if(!r.ok) throw new Error(d.message || 'Failed to load');
        if(d.completed){ navigate(`/courses/${id}`); return; }
        setView(d); setAnswers([null,null,null,null,null]); setResult(null);
      }catch(e){ setError(e.message); }
    })();
  }, [user?.email, id]);

  const setChoice = (qi, idx) => {
    const next = [...answers]; next[qi] = idx; setAnswers(next);
  };

  const submitQuiz = async ()=>{
    setSubmitting(true); setError("");
    try{
      const payload = { lessonIndex: view.lessonIndex, answers: answers.map(a=>Number(a)) };
      if(payload.answers.some((a)=> Number.isNaN(a))) throw new Error("Select all answers");
      const res = await fetch(`${API}/api/courses/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-email': user?.email || '' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if(!res.ok) throw new Error(data.message || 'Submit failed');
      setResult(data);
    }catch(e){ setError(e.message);} finally { setSubmitting(false); }
  };

  const goNext = ()=>{
    if(result?.next?.completed){
      navigate(`/courses/${id}`);
    } else {
      navigate(`/courses/${id}`); // player will load next lesson via /current
    }
  };

  if (authLoading) return <div className="max-w-4xl mx-auto px-4 py-10">Loading…</div>;
  if (!user) return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      Please <Link className="text-pink-600 underline" to="/login">log in</Link> with a child account.
    </div>
  );

  if(error) return <div className="max-w-4xl mx-auto px-4 py-10 text-red-600">{error}</div>;
  if(!view) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  const { course, lesson, lessonIndex } = view;

  return (
    <section className="py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600"><Link to={`/courses/${id}`} className="text-pink-600">Back to video</Link></p>
          <h1 className="font-kids text-2xl font-extrabold">{course.title}</h1>
          <p className="text-gray-700">Quiz for Lesson {lessonIndex+1}: {lesson.title}</p>
        </div>

        <div className="rounded-3xl border bg-white p-5 shadow-sm">
          {!result ? (
            <>
              {lesson.quiz.map((q, qi)=>(
                <div key={qi} className="mb-4">
                  <p className="font-medium mb-2">{qi+1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi)=>(
                      <label key={oi} className={`border rounded-xl px-3 py-2 cursor-pointer ${answers[qi]===oi?'border-pink-500 ring-1 ring-pink-200':''}`}>
                        <input type="radio" name={`q${qi}`} className="mr-2" checked={answers[qi]===oi} onChange={()=>setChoice(qi, oi)} />
                        {String.fromCharCode(65+oi)}. {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitQuiz} disabled={submitting} className="w-full px-4 py-2 rounded-full text-gray-800 btn-fun">
                {submitting? 'Submitting...' : 'Submit quiz'}
              </button>
            </>
          ) : (
            <div className="text-center">
              <p className="text-xl font-semibold">Score: {result.score} / 5</p>
              <p className="text-sm text-gray-600 mt-1">Correct answers: {result.correctAnswers.map(i=>String.fromCharCode(65+i)).join(', ')}</p>
              <button onClick={goNext} className="mt-4 px-4 py-2 rounded-full bg-green-600 text-white">
                {result.next.completed ? 'Finish course' : 'Continue to next lesson'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

