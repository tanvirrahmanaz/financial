// src/pages/admin/CourseEditor.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.config.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// extract YouTube videoId from a full URL or return the raw string if already an ID
function extractYouTubeId(input = "") {
  if (!input) return "";
  // already looks like an ID (11 chars, alnum/underscore/hyphen)
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtube.com")) {
      // https://www.youtube.com/watch?v=VIDEOID
      const vid = url.searchParams.get("v");
      if (vid) return vid;
    }
    if (url.hostname.includes("youtu.be")) {
      // https://youtu.be/VIDEOID
      return url.pathname.replace("/", "");
    }
  } catch (_) {
    // not a URL, maybe raw id
  }
  return input;
}

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
});

const emptyLesson = () => ({
  title: "",
  youtubeId: "",
  quiz: [emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion(), emptyQuestion()],
});

export default function CourseEditor() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lessons, setLessons] = useState([emptyLesson()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const addLesson = () => setLessons((prev) => [...prev, emptyLesson()]);
  const removeLesson = (i) => setLessons((prev) => prev.filter((_, idx) => idx !== i));


  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async(u)=>{
      setUser(u);
      if(u){
        try{
          const res = await fetch(`${API}/api/users/me?email=${encodeURIComponent(u.email)}`);
          const d = await res.json();
          setProfileComplete(!!d?.user?.profileComplete);
        }catch(_){ setProfileComplete(false); }
      } else {
        setProfileComplete(false);
      }
    });
    return ()=>unsub();
  },[]);

 
  const updateLessonField = (i, key, value) => {
    setLessons((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: value };
      return next;
    });
  };

  const setYoutubeInput = (i, raw) => {
    const id = extractYouTubeId(raw.trim());
    updateLessonField(i, "youtubeId", id);
  };

  const updateQuestionText = (li, qi, value) => {
    setLessons((prev) => {
      const next = [...prev];
      const quiz = [...next[li].quiz];
      quiz[qi] = { ...quiz[qi], question: value };
      next[li] = { ...next[li], quiz };
      return next;
    });
  };

  const updateOption = (li, qi, oi, value) => {
    setLessons((prev) => {
      const next = [...prev];
      const quiz = [...next[li].quiz];
      const options = [...quiz[qi].options];
      options[oi] = value;
      quiz[qi] = { ...quiz[qi], options };
      next[li] = { ...next[li], quiz };
      return next;
    });
  };

  const setCorrect = (li, qi, idx) => {
    setLessons((prev) => {
      const next = [...prev];
      const quiz = [...next[li].quiz];
      quiz[qi] = { ...quiz[qi], correctIndex: idx };
      next[li] = { ...next[li], quiz };
      return next;
    });
  };

  const validate = () => {
    if (!title.trim()) return "Course title is required";
    for (let li = 0; li < lessons.length; li++) {
      const L = lessons[li];
      if (!L.title.trim()) return `Lesson ${li + 1}: title is required`;
      if (!L.youtubeId || L.youtubeId.length < 5) return `Lesson ${li + 1}: valid YouTube ID/URL required`;
      if (!Array.isArray(L.quiz) || L.quiz.length !== 5) return `Lesson ${li + 1}: must have exactly 5 quiz questions`;
      for (let qi = 0; qi < 5; qi++) {
        const Q = L.quiz[qi];
        if (!Q.question.trim()) return `Lesson ${li + 1}, Q${qi + 1}: question text required`;
        if (!Array.isArray(Q.options) || Q.options.length !== 4) return `Lesson ${li + 1}, Q${qi + 1}: 4 options required`;
        for (let oi = 0; oi < 4; oi++) {
          if (!Q.options[oi].trim()) return `Lesson ${li + 1}, Q${qi + 1}: option ${String.fromCharCode(65 + oi)} required`;
        }
        if (Q.correctIndex < 0 || Q.correctIndex > 3) return `Lesson ${li + 1}, Q${qi + 1}: select a correct answer`;
      }
    }
    return null;
  };

 const onSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const current = auth.currentUser;
    if (!current?.email) { 
      navigate("/login");
      return;
    }

    // 1) ensure profile is complete before allowing course create
    const meRes = await fetch(`${API}/api/users/me?email=${encodeURIComponent(current.email)}`);
    const meData = await meRes.json();
    if (!meRes.ok) throw new Error(meData.message || "Failed to fetch user");
    if (!meData?.user?.profileComplete) {
      navigate("/complete-profile");
      return;
    }

    // 2) helper: extract YouTube videoId from URL or accept raw id
    const extract = (input = "") => {
      if (!input) return "";
      if (/^[\w-]{11}$/.test(input)) return input;
      try {
        const url = new URL(input);
        if (url.hostname.includes("youtube.com")) {
          const v = url.searchParams.get("v");
          if (v) return v;
        }
        if (url.hostname.includes("youtu.be")) {
          return url.pathname.replace("/", "");
        }
      } catch (_) { /* not a URL */ }
      return input;
    };

    // 3) validate & normalize payload
    if (!title.trim()) throw new Error("Course title is required");

    const normalizedLessons = lessons.map((ls, li) => {
      const t = String(ls.title || "").trim();
      if (!t) throw new Error(`Lesson ${li + 1}: title is required`);

      const youtubeId = extract(String(ls.youtubeId || "").trim());
      if (!youtubeId || youtubeId.length < 5) {
        throw new Error(`Lesson ${li + 1}: valid YouTube ID/URL required`);
      }

      if (!Array.isArray(ls.quiz) || ls.quiz.length !== 5) {
        throw new Error(`Lesson ${li + 1}: must have exactly 5 quiz questions`);
      }

      const quiz = ls.quiz.map((q, qi) => {
        const qText = String(q.question || "").trim();
        if (!qText) throw new Error(`Lesson ${li + 1}, Q${qi + 1}: question text required`);

        const options = Array.isArray(q.options)
          ? q.options.map((o) => String(o || "").trim())
          : [];
        if (options.length !== 4 || options.some((o) => !o)) {
          throw new Error(`Lesson ${li + 1}, Q${qi + 1}: 4 non-empty options required`);
        }

        const correctIndex = Number(q.correctIndex);
        if (!(correctIndex >= 0 && correctIndex <= 3)) {
          throw new Error(`Lesson ${li + 1}, Q${qi + 1}: choose a correct option`);
        }

        return { question: qText, options, correctIndex };
      });

      return { title: t, youtubeId, quiz };
    });

    const payload = {
      title: title.trim(),
      description: String(description || "").trim(),
      lessons: normalizedLessons,
    };

    // 4) create course (admin-gated by server via x-user-email)
    const res = await fetch(`${API}/api/admin/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-email": current.email,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Failed to save course");
    }

    navigate("/admin");
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-1">Create Course</h1>
      <p className="text-gray-600 mb-6">
        Add single-video lessons. Each lesson must include <span className="font-medium">exactly 5 questions</span> (A–D options).
      </p>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Course meta */}
        <div className="rounded-2xl border bg-white p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Course Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-xl px-3 py-2"
                placeholder="e.g. Basic Math"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-xl px-3 py-2"
                rows={3}
                placeholder="Short description..."
              />
            </div>
          </div>
        </div>

        {/* Lessons */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lessons</h2>
            <button
              type="button"
              onClick={addLesson}
              className="px-3 py-2 rounded-xl border hover:bg-gray-50"
            >
              + Add lesson
            </button>
          </div>

          {lessons.map((ls, li) => (
            <div key={li} className="rounded-2xl border bg-white p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">Lesson Title</label>
                    <input
                      value={ls.title}
                      onChange={(e) => updateLessonField(li, "title", e.target.value)}
                      className="w-full border rounded-xl px-3 py-2"
                      placeholder={`Lesson ${li + 1} title`}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">YouTube URL or ID</label>
                    <input
                      value={ls.youtubeId}
                      onChange={(e) => setYoutubeInput(li, e.target.value)}
                      className="w-full border rounded-xl px-3 py-2"
                      placeholder="https://youtu.be/VIDEO_ID or VIDEO_ID"
                      required
                    />
                    {ls.youtubeId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Parsed video ID: <span className="font-mono">{extractYouTubeId(ls.youtubeId)}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeLesson(li)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>

              {/* Quiz block */}
              <div className="mt-4">
                <p className="font-medium mb-3">Quiz — 5 questions</p>
                <div className="space-y-4">
                  {ls.quiz.map((q, qi) => (
                    <div key={qi} className="border rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-medium">
                          Q{qi + 1}
                        </label>
                        <span className="text-xs text-gray-500">
                          Select the correct option
                        </span>
                      </div>

                      <input
                        value={q.question}
                        onChange={(e) => updateQuestionText(li, qi, e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mb-3"
                        placeholder="Question text..."
                        required
                      />

                      <div className="grid md:grid-cols-2 gap-2">
                        {q.options.map((opt, oi) => {
                          const label = String.fromCharCode(65 + oi);
                          const checked = q.correctIndex === oi;
                          return (
                            <label
                              key={oi}
                              className={`relative border rounded-xl px-3 py-2 cursor-pointer flex items-center gap-2 ${
                                checked ? "border-indigo-600 ring-1 ring-indigo-200" : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name={`l${li}-q${qi}`}
                                className="peer"
                                checked={checked}
                                onChange={() => setCorrect(li, qi, oi)}
                              />
                              <span className="text-xs font-semibold w-5 h-5 inline-flex items-center justify-center rounded bg-gray-100">
                                {label}
                              </span>
                              <input
                                value={opt}
                                onChange={(e) => updateOption(li, qi, oi, e.target.value)}
                                className="flex-1 outline-none"
                                placeholder={`Option ${label}`}
                                required
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {lessons.length === 0 && (
            <p className="text-sm text-gray-600">No lessons yet. Click “Add lesson”.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save course"}
        </button>
      </form>
    </div>
  );
}
