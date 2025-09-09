// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API}/api/courses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map(course => (
            <Link to={`/courses/${course._id}`} key={course._id} className="block">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                  <p className="text-gray-600">{course.description}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No courses available yet.</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
