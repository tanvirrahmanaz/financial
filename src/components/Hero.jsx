// src/components/Hero.jsx
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-indigo-50 to-transparent">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
            Fun learning for <span className="text-indigo-600">kids</span>,
            clear insights for <span className="text-indigo-600">parents</span>.
          </h1>
          <p className="text-gray-600 mb-6">
            Watch lessons, take quizzes, and track progress—all in one simple platform.
          </p>
          <div className="flex gap-3">
            <Link to="/signup" className="px-5 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Get Started</Link>
            <a href="#courses" className="px-5 py-3 rounded-xl border hover:bg-white">Browse Courses</a>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-video w-full rounded-2xl bg-black/5 border overflow-hidden">
            <img src="https://images.unsplash.com/photo-1601933470928-c1b9a9f1a0c5?q=80&w=1200&auto=format&fit=crop" alt="Learning" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 bg-white border shadow rounded-2xl p-4 w-64">
            <p className="text-sm text-gray-500">This week</p>
            <p className="text-2xl font-bold">+42% progress</p>
          </div>
        </div>
      </div>
    </section>
  );
}