// src/pages/AdminPanel.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [hasQuiz, setHasQuiz] = useState(true); // State to toggle quiz section
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubePlaylistUrl: '', // Changed to URL
    quizzes: Array(5).fill({ question: '', options: ['', '', '', ''], correctAnswer: '' }),
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuizChange = (quizIndex, e) => {
    const newQuizzes = [...formData.quizzes];
    newQuizzes[quizIndex][e.target.name] = e.target.value;
    setFormData({ ...formData, quizzes: newQuizzes });
  };

  const handleOptionChange = (quizIndex, optionIndex, e) => {
    const newQuizzes = [...formData.quizzes];
    newQuizzes[quizIndex].options[optionIndex] = e.target.value;
    setFormData({ ...formData, quizzes: newQuizzes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Extract YouTube Playlist ID from the URL
    const url = new URL(formData.youtubePlaylistUrl);
    const youtubePlaylistId = url.searchParams.get('list');
    
    if (!youtubePlaylistId) {
        return setError('Invalid YouTube Playlist URL. Please provide a URL that contains a playlist ID.');
    }

    const payload = {
        ...formData,
        youtubePlaylistId,
        quizzes: hasQuiz ? formData.quizzes : [],
    };

    try {
      const response = await fetch(`${API}/api/admin/upload-course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setFormData({
          title: '',
          description: '',
          youtubePlaylistUrl: '',
          quizzes: Array(5).fill({ question: '', options: ['', '', '', ''], correctAnswer: '' }),
        });
      } else {
        setError(data.message || 'Course upload failed.');
      }
    } catch (err) {
      setError('A network error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Admin Panel: Upload Course</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          {/* General Course Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Course Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">YouTube Playlist URL</label>
              <input type="url" name="youtubePlaylistUrl" value={formData.youtubePlaylistUrl} onChange={handleChange} className="w-full p-3 border rounded-md" required />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-md" rows="4" required></textarea>
          </div>
          
          {/* Quiz Toggle */}
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Include Quizzes?</h2>
              <button
                  type="button"
                  onClick={() => setHasQuiz(!hasQuiz)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-300 ${hasQuiz ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
              >
                  {hasQuiz ? 'Yes' : 'No'}
              </button>
          </div>

          {/* Quizzes Section (Conditional) */}
          {hasQuiz && (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Quizzes (5 Questions)</h2>
              {formData.quizzes.map((quiz, quizIndex) => (
                <div key={quizIndex} className="border border-gray-300 p-6 rounded-lg mb-6 bg-gray-50">
                  <h3 className="text-xl font-medium mb-4 text-gray-700">Question {quizIndex + 1}</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700">Question Text</label>
                    <input type="text" name="question" value={quiz.question} onChange={(e) => handleQuizChange(quizIndex, e)} className="w-full p-3 border rounded-md" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quiz.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label className="block text-gray-700">Option {optionIndex + 1}</label>
                        <input type="text" value={option} onChange={(e) => handleOptionChange(quizIndex, optionIndex, e)} className="w-full p-3 border rounded-md" required />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block text-gray-700">Correct Answer</label>
                    <input type="text" name="correctAnswer" value={quiz.correctAnswer} onChange={(e) => handleQuizChange(quizIndex, e)} className="w-full p-3 border rounded-md" required />
                    <p className="text-sm text-gray-500 mt-1">Please enter one of the options above.</p>
                  </div>
                </div>
              ))}
            </>
          )}

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300">
            Upload Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
