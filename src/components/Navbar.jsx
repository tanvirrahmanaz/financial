// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";
const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ADMIN_EMAIL = "admin@gmail.com";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profileComplete, setProfileComplete] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setRole(null);
      setProfileComplete(null);
      setUsername(null);
      if (u?.email) {
        try {
          const res = await fetch(`${API}/api/users/me?email=${encodeURIComponent(u.email)}`);
          const data = await res.json();
          if (res.ok) {
            setRole(data.user?.role || null);
            setProfileComplete(!!data.user?.profileComplete);
            setUsername(data.user?.username || null);
          }
        } catch (_) { /* ignore */ }
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-amber-50/95 backdrop-blur border-b border-black/5">
      <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-3 items-center">
        {/* Brand */}
        <Link to="/" className="justify-self-start">
          <div className="flex items-center gap-3">
            {/* <img src="/image.png" alt="Chotto Shonchoyi" className="w-10 h-10 rounded-full object-cover ring-1 ring-black/10" /> */}
            <div className="font-kids text-xl font-semibold">Chotto Shonchoyi</div>
          </div>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center justify-center gap-8 text-gray-800 font-medium">
          <NavLink to="/" className={({isActive})=>`hover:text-black ${isActive?"text-black":""}`}>Home</NavLink>
          <NavLink to="/courses" className={({isActive})=>`hover:text-black ${isActive?"text-black":""}`}>Courses</NavLink>
          <a href="#about" className="hover:text-black">About Us</a>
          <a href="#contact" className="hover:text-black">Contact</a>
          {user?.email === ADMIN_EMAIL && (
            <NavLink to="/admin" className={({isActive})=>`hover:text-black ${isActive?"text-black":""}`}>Admin</NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center justify-self-end gap-3">
          {user ? (
            <>
              <NavLink
                to={user?.email === ADMIN_EMAIL ? "/admin" : role === 'PARENT' ? "/parent" : "/child"}
                className="px-5 py-2 rounded-full border border-black/50 hover:bg-black/5"
              >
                Dashboard
              </NavLink>
              <button onClick={handleLogout} className="px-5 py-2 rounded-full border border-black/20 hover:bg-black/5">Logout</button>
            </>
          ) : (
            <>
              {pathname !== "/login" && (
                <Link to="/login" className="px-5 py-2 rounded-full border border-black/60 hover:bg-black/5">Log in</Link>
              )}
              {pathname !== "/signup" && (
                <Link to="/signup" className="px-5 py-2 rounded-full border border-black/60 hover:bg-black/5">Sign Up</Link>
              )}
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button onClick={()=>setOpen(!open)} className="md:hidden justify-self-end inline-flex items-center justify-center w-10 h-10 rounded-full border">
          <span className="i">≡</span>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-2">
            <NavLink to="/" onClick={()=>setOpen(false)} className="py-2">Home</NavLink>
            <NavLink to="/courses" onClick={()=>setOpen(false)} className="py-2">Courses</NavLink>
            <a href="#about" onClick={()=>setOpen(false)} className="py-2">About Us</a>
            <a href="#contact" onClick={()=>setOpen(false)} className="py-2">Contact</a>
            {user?.email === ADMIN_EMAIL && (
              <NavLink to="/admin" onClick={()=>setOpen(false)} className="py-2">Admin</NavLink>
            )}
            <div className="pt-2 grid grid-cols-2 gap-2">
              {user ? (
                <>
                  <NavLink
                    to={user?.email === ADMIN_EMAIL ? "/admin" : role === 'PARENT' ? "/parent" : "/child"}
                    onClick={()=>setOpen(false)}
                    className="px-4 py-2 rounded-full border text-center"
                  >Dashboard</NavLink>
                  <button onClick={handleLogout} className="px-4 py-2 rounded-full border text-center">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-full border text-center">Log in</Link>
                  <Link to="/signup" onClick={()=>setOpen(false)} className="px-4 py-2 rounded-full border text-center">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
