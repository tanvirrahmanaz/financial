// src/pages/Signup.jsx  (CLIENT — after signup, go based on profileComplete)
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, createUserWithEmailAndPassword, signInWithGoogle } from "../firebase/firebase.config.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const ADMIN_EMAIL = "admin@gmail.com";

async function routeAfterLogin(navigate, email) {
  try {
    if (email && email.toLowerCase() === ADMIN_EMAIL) {
      navigate("/admin");
      return;
    }
    const res = await fetch(`${API}/api/users/me?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (res.ok && data.user?.profileComplete) {
      navigate("/");
    } else {
      navigate("/complete-profile");
    }
  } catch {
    navigate("/complete-profile");
  }
}

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // If already authenticated, never show signup — redirect to destination
  useEffect(() => {
    const u = auth.currentUser;
    if (u?.email) {
      routeAfterLogin(navigate, u.email);
    }
  }, [navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, role, email })
      });
      await routeAfterLogin(navigate, cred.user.email);
    } catch (err) {
      const code = String(err?.code || '').replace('auth/', '');
      const nice = (
        code === 'email-already-in-use' ? 'This email is already registered' :
        code === 'invalid-email' ? 'Please enter a valid email' :
        code === 'weak-password' ? 'Password should be at least 6 characters' :
        err.message
      );
      setError(nice);
    } finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      await fetch(`${API}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user?.displayName || name, role, email: user?.email })
      });
      await routeAfterLogin(navigate, user.email);
    } catch (err) {
      const code = String(err?.code || '').replace('auth/', '');
      const nice = (
        code === 'popup-closed-by-user' ? 'Popup closed before completing sign in' :
        code === 'operation-not-allowed' ? 'Google sign-in not enabled for this project' :
        code === 'unauthorized-domain' ? 'This domain is not authorized in Firebase' :
        err.message
      );
      setError(nice);
    } finally { setLoading(false); }
  };

  return (
    <section className="py-14">
      <div className="max-w-md mx-auto bg-white/90 border rounded-3xl shadow p-6">
        <h1 className="font-kids text-3xl font-extrabold mb-1">Create account 🧸</h1>
        <p className="text-gray-700 mb-6">Join and start learning</p>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" className="w-full border rounded-xl px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full border rounded-xl px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full border rounded-xl px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select value={role} onChange={(e)=>setRole(e.target.value)} className="w-full border rounded-xl px-3 py-2">
              <option value="PARENT">Parent</option>
              <option value="CHILD">Child</option>
            </select>
          </div>
          <button disabled={loading} className="w-full px-4 py-2 rounded-full text-gray-800 btn-fun disabled:opacity-60">{loading?"Creating...":"Sign up"}</button>
        </form>
        <button onClick={handleGoogle} disabled={loading} className="mt-4 w-full px-4 py-2 rounded-full border bg-white hover:bg-gray-50 disabled:opacity-60">Sign up with Google</button>
        <p className="text-sm text-gray-600 mt-4">Already have an account? <Link to="/login" className="text-pink-600">Log in</Link></p>
      </div>
    </section>
  );
}
