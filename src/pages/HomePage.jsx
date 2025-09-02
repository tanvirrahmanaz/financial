// src/pages/HomePage.jsx
import React from 'react';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import Testimonials from '../components/Testimonials';

const HomePage = () => {
  return (
    <>
      <Hero />
      <Courses />
      <Testimonials />
    </>
  );
};

export default HomePage;