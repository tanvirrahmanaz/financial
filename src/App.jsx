// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import CoursesSection from "./components/CoursesSection.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import CompleteProfile from "./pages/CompleteProfile.jsx";
import Courses from "./pages/Courses.jsx";
import CoursePlayer from "./pages/CoursePlayer.jsx";
import CourseQuiz from "./pages/CourseQuiz.jsx";
import ParentProgress from "./pages/ParentProgress.jsx";
import ParentDashboard from "./pages/ParentDashboard.jsx";
import ParentCoursePlayer from "./pages/ParentCoursePlayer.jsx";
import ChildDashboard from "./pages/ChildDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CourseEditor from "./pages/admin/CourseEditor.jsx";
import AdminCourseView from "./pages/admin/AdminCourseView.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-kids">
      <Navbar />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <div className="max-w-6xl mx-auto px-4">
              <CoursesSection />
              <Testimonials />
            </div>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />

        {/* Courses (child) */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CoursePlayer />} />
        <Route path="/courses/:id/quiz" element={<CourseQuiz />} />

        {/* Parent */}
        <Route path="/parent" element={<ParentDashboard />} />
        <Route path="/parent/progress" element={<ParentProgress />} />
        <Route path="/parent/child/:username/courses/:courseId" element={<ParentCoursePlayer />} />
        {/* Child */}
        <Route path="/child" element={<ChildDashboard />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/courses/new" element={<CourseEditor />} />
        <Route path="/admin/courses/:id/edit" element={<CourseEditor />} />
        <Route path="/admin/courses/:id" element={<AdminCourseView />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}
