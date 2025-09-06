// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { auth } from "../firebase/firebase.config.js";
import { onAuthStateChanged, signOut } from "firebase/auth";

const ADMIN_EMAIL = "admin@gmail.com";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const avatarUrl = (u) => {
    if (!u) return "";
    if (u.photoURL) return u.photoURL;
    if (u.email) return `https://ui-avatars.com/api/?name=${encodeURIComponent(u.email)}`;
    return "https://ui-avatars.com/api/?name=User";
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl tracking-tight">
          Learn<span className="text-indigo-600">Hub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({isActive})=>`hover:text-indigo-600 ${isActive?"text-indigo-600":"text-gray-700"}`}>Home</NavLink>
          <a href="#courses" className="text-gray-700 hover:text-indigo-600">Courses</a>
          <a href="#testimonials" className="text-gray-700 hover:text-indigo-600">Testimonials</a>
          {user?.email === ADMIN_EMAIL && (
            <NavLink to="/admin" className={({isActive})=>`hover:text-indigo-600 ${isActive?"text-indigo-600":"text-gray-700"}`}>Admin</NavLink>
          )}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <img src={avatarUrl(user)} alt="avatar" className="w-8 h-8 rounded-full border" />
              <span className="text-sm text-gray-700">{user.email}</span>
              <button onClick={handleLogout} className="px-3 py-1 rounded-xl border hover:bg-gray-100 text-sm">Logout</button>
            </div>
          ) : (
            <>
              {pathname !== "/login" && (
                <Link to="/login" className="px-4 py-2 rounded-xl border hover:bg-gray-100">Log in</Link>
              )}
              {pathname !== "/signup" && (
                <Link to="/signup" className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Sign up</Link>
              )}
            </>
          )}
        </div>
        <button onClick={()=>setOpen(!open)} className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border">
          <span className="i">≡</span>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col gap-2">
            <NavLink to="/" onClick={()=>setOpen(false)} className="py-2">Home</NavLink>
            <a href="#courses" onClick={()=>setOpen(false)} className="py-2">Courses</a>
            <a href="#testimonials" onClick={()=>setOpen(false)} className="py-2">Testimonials</a>
            {user?.email === ADMIN_EMAIL && (
              <NavLink to="/admin" onClick={()=>setOpen(false)} className="py-2">Admin</NavLink>
            )}
            <div className="pt-2 flex gap-2">
              {user ? (
                <>
                  <img src={avatarUrl(user)} alt="avatar" className="w-8 h-8 rounded-full border" />
                  <button onClick={handleLogout} className="flex-1 px-4 py-2 rounded-xl border text-center">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={()=>setOpen(false)} className="flex-1 px-4 py-2 rounded-xl border text-center">Log in</Link>
                  <Link to="/signup" onClick={()=>setOpen(false)} className="flex-1 px-4 py-2 rounded-xl bg-indigo-600 text-white text-center">Sign up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
