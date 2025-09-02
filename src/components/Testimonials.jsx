// src/components/Testimonials.jsx
import React from 'react';

const TestimonialCard = ({ quote, author, borderColor, bgColor }) => (
  <div className={`p-6 rounded-lg ${bgColor} border-l-4 ${borderColor} max-w-2xl mx-auto shadow-subtle`}>
    <p className="italic text-gray-700 mb-4">"{quote}"</p>
    <p className="text-right font-semibold text-dark-brown">- {author}</p>
  </div>
);

const Testimonials = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-widest text-dark-brown/80 mb-12 text-center">
          TESTIMONIALS
        </h2>
        <div className="space-y-8">
          <TestimonialCard
            quote="I never knew learning about money could be so fun! This app taught me how to save, spend wisely, and even plan for the future. Now, I feel more confident about managing my own money!"
            author="Aisha, 13"
            borderColor="border-blue-300"
            bgColor="bg-blue-50/50"
          />
          <TestimonialCard
            quote="Teaching kids about finances has always been a challenge, but this app makes it so easy and engaging. My child now understands the value of money and the importance of saving. Highly recommended!"
            author="Mrs. Rahman, Parent"
            borderColor="border-pink-300"
            bgColor="bg-pink-50/50"
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;