// src/pages/CourseUploadPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CourseUploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [price, setPrice] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnail) {
      setMessage('Please upload a thumbnail image.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    // Step 1: Upload thumbnail to ImgBB
    const formData = new FormData();
    formData.append('image', thumbnail);
    // নিচের কী-টি আপনার নিজের ImgBB API Key দিয়ে পরিবর্তন করুন
    const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY';

    try {
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
      });

      const imgbbResult = await imgbbResponse.json();

      if (!imgbbResult.success) {
        throw new Error('Image upload failed: ' + imgbbResult.error.message);
      }
      
      const thumbnailUrl = imgbbResult.data.url;

      // Step 2: Prepare course data to send to your server
      const courseData = {
        title,
        description,
        instructor,
        price: Number(price),
        videoUrl,
        thumbnailUrl, // Use the URL from ImgBB
      };

      console.log('Course Data to be sent to server:', courseData);

      // Step 3: Send course data to your backend server
      // (এখানে আপনার নিজের সার্ভারে ডেটা পাঠানোর কোড থাকবে)
      // const serverResponse = await fetch('http://localhost:5000/api/courses/upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(courseData),
      // });
      // const serverResult = await serverResponse.json();

      // For demonstration purposes, we'll just show a success message.
      setMessage('Course uploaded successfully!');
      setIsLoading(false);

      // Redirect to another page after some time
      setTimeout(() => {
        // navigate(`/courses/${serverResult.courseId}`); // Navigate to the new course page
        navigate('/');
      }, 2000);

    } catch (error) {
      console.error('Error uploading course:', error);
      setMessage('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-dark-brown mb-8">Upload New Course</h1>
      <form onSubmit={handleSubmit} className="bg-white/60 p-8 rounded-2xl shadow-subtle space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Course Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow" />
        </div>
        <div>
          <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructor Name</label>
          <input type="text" id="instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow" />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Course Description</label>
          <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow"></textarea>
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (BDT)</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow" />
        </div>
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">Video URL (e.g., Unlisted YouTube Link)</label>
          <input type="url" id="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-soft-yellow" />
        </div>
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">Course Thumbnail</label>
          <input type="file" id="thumbnail" accept="image/*" onChange={handleThumbnailChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-soft-yellow/50 file:text-dark-brown hover:file:bg-soft-yellow" />
        </div>
        <div>
          <button type="submit" disabled={isLoading} className="w-full bg-dark-brown text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {isLoading ? 'Uploading...' : 'Upload Course'}
          </button>
        </div>
        {message && <p className={`text-center font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      </form>
    </div>
  );
};

export default CourseUploadPage;