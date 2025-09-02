// src/components/Hero.jsx
import React from 'react';

const Hero = () => {
  return (
    <section className="text-center py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-2xl font-semibold tracking-widest text-dark-brown/80 mb-6">LEARN</h2>
        
        <div className="flex justify-center items-center gap-8 md:gap-12 mb-10">
          <h1 className="text-4xl md:text-6xl font-bold">How</h1>
          {/* Replace with your actual image URL */}
          <img 
            src="https://i.ibb.co/L5k6Y1w/hero-kids-image.png" 
            alt="Kids learning about money" 
            className="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full shadow-subtle"
          />
          <h1 className="text-4xl md:text-6xl font-bold">To</h1>
        </div>
        
        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button className="w-full md:w-auto text-2xl font-bold bg-soft-blue text-dark-brown px-16 py-4 rounded-2xl shadow-subtle hover:scale-105 transition-transform">
            Earn
          </button>
          <button className="w-full md:w-auto text-2xl font-bold bg-soft-yellow text-dark-brown px-16 py-4 rounded-2xl shadow-subtle hover:scale-105 transition-transform">
            Save
          </button>
          <button className="w-full md:w-auto text-2xl font-bold bg-soft-pink text-dark-brown px-16 py-4 rounded-2xl shadow-subtle hover:scale-105 transition-transform">
            Invest
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;