// src/components/Courses.jsx
import React from 'react';
import { BsArrowRight } from 'react-icons/bs';

const CourseCard = ({ title, ageRange, imageUrl }) => (
  <div className="bg-white/80 border border-dark-brown/10 rounded-2xl shadow-subtle overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
    <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
    <div className="p-5 text-left">
      <h3 className="text-lg font-bold mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{ageRange}</p>
      <a href="#" className="font-semibold text-sm flex items-center gap-2 hover:text-soft-yellow transition-colors">
        View Course <BsArrowRight />
      </a>
    </div>
  </div>
);

const Courses = () => {
  const popularCourses = [
    { title: 'Money Basics for Young Savers', ageRange: '(Ages 7-10)', imageUrl: 'https://i.ibb.co/hCKjCFs/course-image.png' },
    { title: 'Introduction to Investing', ageRange: '(Ages 11-14)', imageUrl: 'https://i.ibb.co/hCKjCFs/course-image.png' },
    { title: 'Smart Spending Habits', ageRange: '(Ages 7-10)', imageUrl: 'https://i.ibb.co/hCKjCFs/course-image.png' },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl relative">
        <h2 className="text-2xl font-semibold tracking-widest text-dark-brown/80 mb-10 text-center md:text-left">
          POPULAR COURSES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {popularCourses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
        <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-md text-soft-yellow text-2xl hover:bg-soft-yellow hover:text-white transition-colors">
          <BsArrowRight />
        </button>
      </div>
    </section>
  );
};

export default Courses;