// src/pages/Login.jsx  (CLIENT — navigate based on profileComplete + return to `from`)
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, signInWithEmailAndPassword, signInWithGoogle } from "../firebase/firebase.config.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function routeAfterLogin(navigate, email, fromPath) {
  try {
    const res = await fetch(`${API}/api/users/me?email=${encodeURIComponent(email)}`);
    const data = await res.json();

    const backTo = fromPath || "/";

    if (res.ok && data.user?.profileComplete) {
      navigate(backTo);
    } else {
      // send to complete profile but remember where to go back
      navigate("/complete-profile", { state: { from: backTo } });
    }
  } catch {
    navigate("/complete-profile", { state: { from: fromPath || "/" } });
  }
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await routeAfterLogin(navigate, cred.user.email, from);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (!user) throw new Error("Google sign-in failed");
      await routeAfterLogin(navigate, user.email, from);
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-14">
      <div className="max-w-md mx-auto bg-white border rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-gray-600 mb-6">Log in to continue</p>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              type="email"
              className="w-full border rounded-xl px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              type="password"
              className="w-full border rounded-xl px-3 py-2"
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-4 w-full px-4 py-2 rounded-xl border hover:bg-gray-50 disabled:opacity-60"
        >
          Continue with Google
        </button>
        <p className="text-sm text-gray-600 mt-4">
          No account? <Link to="/signup" className="text-indigo-600">Sign up</Link>
        </p>
      </div>
    </section>
  );
}
