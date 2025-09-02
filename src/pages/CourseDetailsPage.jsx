// src/pages/CourseDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// ডেমো ডেটা, কারণ আমাদের এখনো কোনো সার্ভার নেই
const mockCourseData = {
  id: '123',
  title: 'Money Basics for Young Savers',
  instructor: 'Tanvir Rahman',
  description: 'This course is designed to teach young learners the fundamental concepts of money management. From earning and saving to smart spending, we cover all the basics in a fun and engaging way. Our goal is to build a strong financial foundation for kids early on.',
  price: 500,
  thumbnailUrl: 'https://i.ibb.co/hCKjCFs/course-image.png', // URL from ImgBB
  videoUrl: 'https://www.youtube.com/embed/exampleVideoId', // Example Embeddable YouTube URL
};

// YouTube URL-কে Embeddable URL-এ কনভার্ট করার ফাংশন
const getYouTubeEmbedUrl = (url) => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}`;
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (error) {
    // If it's not a valid URL or not a YouTube URL, return it as is
    return url;
  }
  return url; // Fallback
};

const CourseDetailsPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // এখানে আপনার সার্ভার থেকে ডেটা আনার কোড থাকবে
    // fetch(`http://localhost:5000/api/courses/${courseId}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     setCourse(data);
    //     setIsLoading(false);
    //   });

    // আপাতত আমরা ডেমো ডেটা ব্যবহার করছি
    setTimeout(() => {
      setCourse(mockCourseData);
      setIsLoading(false);
    }, 1000);
  }, [courseId]);

  if (isLoading) {
    return <div className="text-center py-20">Loading course details...</div>;
  }

  if (!course) {
    return <div className="text-center py-20">Course not found.</div>;
  }
  
  const embeddableVideoUrl = getYouTubeEmbedUrl(course.videoUrl);

  return (
    <div className="container mx-auto max-w-6xl py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Video Player */}
        <div className="lg:col-span-2">
          <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-subtle mb-6">
            <iframe 
              src={embeddableVideoUrl}
              title={course.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
           <h1 className="text-3xl lg:text-4xl font-bold text-dark-brown mb-2">{course.title}</h1>
           <p className="text-lg text-gray-600">by <span className="font-semibold">{course.instructor}</span></p>
        </div>
        
        {/* Right Side: Course Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 p-6 rounded-2xl shadow-subtle">
            <img src={course.thumbnailUrl} alt={course.title} className="w-full rounded-lg mb-4" />
            <div className="text-3xl font-bold text-dark-brown mb-4">৳ {course.price}</div>
            <button className="w-full bg-dark-brown text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity">
              Enroll Now
            </button>
            <hr className="my-6" />
            <h3 className="text-xl font-bold mb-2">About this course</h3>
            <p className="text-gray-700">{course.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;