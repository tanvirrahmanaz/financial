// src/pages/CompleteProfile.jsx  (CLIENT — skip if already complete + prefill)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CompleteProfile() {
  const [role, setRole] = useState("PARENT");
  const [username, setUsername] = useState("");
  const [childUsername, setChildUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [occupation, setOccupation] = useState("");
  const [address, setAddress] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [checking, setChecking] = useState(false);
  const [isFree, setIsFree] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [prefetching, setPrefetching] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const u = auth.currentUser;
    (async () => {
      if (!u?.email) { setPrefetching(false); return; }
      try {
        const res = await fetch(`${API}/api/users/me?email=${encodeURIComponent(u.email)}`);
        const data = await res.json();
        if (res.ok && data.user) {
          if (data.user.profileComplete) {
            navigate("/"); // already complete
            return;
          }
          // prefill
          if (data.user.role) setRole(data.user.role);
          if (data.user.username) setUsername(data.user.username);
          const p = data.user.profile || {};
          if (p.name) setName(p.name);
          if (p.age) setAge(String(p.age));
          if (p.phone) setPhone(p.phone);
          if (p.occupation) setOccupation(p.occupation);
          if (p.address) setAddress(p.address);
          if (p.grade) setGrade(p.grade);
          if (p.school) setSchool(p.school);
        }
      } finally { setPrefetching(false); }
    })();
  }, [navigate]);

  const debounceRef = useMemo(() => ({ t: null }), []);
  const checkUsername = (name) => {
    clearTimeout(debounceRef.t);
    setChecking(true);
    debounceRef.t = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/users/check-username?username=${encodeURIComponent(name)}`);
        const data = await res.json();
        setIsFree(data?.available === true);
      } catch { setIsFree(null); } finally { setChecking(false); }
    }, 350);
  };
  const onUsernameChange = (e) => {
    const v = e.target.value.trim();
    setUsername(v);
    if (v.length >= 3) checkUsername(v);
    else setIsFree(null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const current = auth.currentUser;
      if (!current?.email) throw new Error("No logged in user email found");
      const profile = {
        name: name || undefined,
        age: age ? Number(age) : undefined,
        phone: role === "PARENT" ? (phone || undefined) : undefined,
        occupation: role === "PARENT" ? (occupation || undefined) : undefined,
        address: role === "PARENT" ? (address || undefined) : undefined,
        grade: role === "CHILD" ? (grade || undefined) : undefined,
        school: role === "CHILD" ? (school || undefined) : undefined,
      };
      const body = {
        email: current.email,
        role,
        username,
        childUsername: role === "PARENT" ? (childUsername || undefined) : undefined,
        profile,
      };
      const res = await fetch(`${API}/api/users/complete-profile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({message:"Failed"}));
        throw new Error(err.message || "Failed to save");
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  if (prefetching) return <div className="max-w-2xl mx-auto px-4 py-10">Loading...</div>;

  return (
    <section className="py-14">
      <div className="max-w-2xl mx-auto bg-white border rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-1">Complete your profile</h1>
        <p className="text-gray-600 mb-6">Select your role and set a unique username.</p>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full border rounded-xl px-3 py-2">
              <option value="PARENT">Parent</option>
              <option value="CHILD">Child</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className="w-full border rounded-xl px-3 py-2" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input value={username} onChange={onUsernameChange} type="text" placeholder="e.g. nadia_parent or arif2004" className="w-full border rounded-xl px-3 py-2" required />
            <p className={`text-xs mt-1 ${isFree===false? 'text-red-600':'text-gray-500'}`}>
              {checking ? "Checking availability..." : isFree===true ? "Username is available" : isFree===false ? "Username is taken" : "3+ chars, letters/numbers/underscore"}
            </p>
          </div>
          <div>
            <label className="block text-sm mb-1">Age</label>
            <input value={age} onChange={(e)=>setAge(e.target.value)} type="number" min="1" max="120" className="w-full border rounded-xl px-3 py-2" placeholder="e.g. 10" />
          </div>
          {role === "PARENT" && (
            <>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input value={phone} onChange={(e)=>setPhone(e.target.value)} type="tel" className="w-full border rounded-xl px-3 py-2" placeholder="017XXXXXXXX" />
              </div>
              <div>
                <label className="block text-sm mb-1">Occupation</label>
                <input value={occupation} onChange={(e)=>setOccupation(e.target.value)} type="text" className="w-full border rounded-xl px-3 py-2" placeholder="Service / Business" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Address</label>
                <input value={address} onChange={(e)=>setAddress(e.target.value)} type="text" className="w-full border rounded-xl px-3 py-2" placeholder="Street, City" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-1">Child's username (optional)</label>
                <input value={childUsername} onChange={(e)=>setChildUsername(e.target.value.trim())} type="text" className="w-full border rounded-xl px-3 py-2" placeholder="e.g. rayhan_kid" />
              </div>
            </>
          )}
          {role === "CHILD" && (
            <>
              <div>
                <label className="block text-sm mb-1">Class / Grade</label>
                <input value={grade} onChange={(e)=>setGrade(e.target.value)} type="text" className="w-full border rounded-xl px-3 py-2" placeholder="Class 4" />
              </div>
              <div>
                <label className="block text-sm mb-1">School</label>
                <input value={school} onChange={(e)=>setSchool(e.target.value)} type="text" className="w-full border rounded-xl px-3 py-2" placeholder="ABC School" />
              </div>
            </>
          )}
          <div className="md:col-span-2">
            <button disabled={loading || isFree===false} className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60">
              {loading?"Saving...":"Save & Continue"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
