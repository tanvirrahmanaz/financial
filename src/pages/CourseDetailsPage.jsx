// src/pages/CourseDetailsPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import YouTube from 'react-youtube';

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error('Course not found');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const onPlayerReady = (event) => {
    // You can control the player here if needed
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex(prevIndex => prevIndex + 1);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  if (loading) return <div className="text-center mt-10">Loading course details...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  if (!course) return <div className="text-center mt-10">Course not found.</div>;

  const playerOptions = {
    height: '390',
    width: '100%',
    playerVars: {
      listType: 'playlist',
      list: course.youtubePlaylistId,
      index: currentVideoIndex,
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-4">{course.title}</h1>
      <p className="text-center text-gray-600 mb-8">{course.description}</p>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <YouTube opts={playerOptions} onReady={onPlayerReady} />
      </div>

      <div className="flex justify-center space-x-4 mb-8">
          <button
              onClick={handlePrevVideo}
              disabled={currentVideoIndex === 0}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full disabled:opacity-50"
          >
              Previous Video
          </button>
          <button
              onClick={handleNextVideo}
              className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
              Next Video
          </button>
      </div>

      {course.quizzes.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Quiz Time!</h2>
              {course.quizzes.map((quiz, index) => (
                  <div key={index} className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">{index + 1}. {quiz.question}</h3>
                      <div className="space-y-2">
                          {quiz.options.map((option, optIndex) => (
                              <div key={optIndex} className="bg-gray-100 p-3 rounded-md">
                                  {option}
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      )}
    </div>
  );
};

export default CourseDetailsPage;