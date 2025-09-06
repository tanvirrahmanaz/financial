// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase/firebase.config.js";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const ADMIN_EMAIL = "admin@gmail.com";

export default function AdminDashboard(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const me = auth.currentUser;

  useEffect(()=>{
    const run = async ()=>{
      try{
        const res = await fetch(`${API}/api/admin/users`, { headers: { "x-user-email": me?.email || "" } });
        const data = await res.json();
        if(res.ok) setUsers(data.users || []);
      } finally { setLoading(false); }
    };
    if(me?.email === ADMIN_EMAIL) run();
  },[me?.email]);

  if(me?.email !== ADMIN_EMAIL){
    return <div className="max-w-6xl mx-auto px-4 py-12">Not authorized.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link to="/admin/courses/new" className="px-4 py-2 rounded-xl bg-indigo-600 text-white">New Course</Link>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <h2 className="font-semibold mb-3">All Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Role</th>
                  <th className="py-2 pr-4">Username</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u=> (
                  <tr key={u._id} className="border-t">
                    <td className="py-2 pr-4">{u.name || u.profile?.name || "-"}</td>
                    <td className="py-2 pr-4">{u.email || "-"}</td>
                    <td className="py-2 pr-4">{u.role}</td>
                    <td className="py-2 pr-4">{u.username || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
