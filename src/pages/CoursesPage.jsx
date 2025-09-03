// src/pages/CoursesPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/courses');
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

  if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading courses...</div>;
  if (error) return <div className="text-center mt-10 text-red-500 text-lg font-semibold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-dark-brown">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map(course => (
            <Link to={`/courses/${course._id}`} key={course._id} className="block">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-transform duration-300">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-dark-brown">{course.title}</h2>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <span className="text-sm font-semibold text-soft-yellow">View Course →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 text-lg">No courses available yet. Please check back later!</p>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;