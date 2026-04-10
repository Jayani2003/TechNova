import React from 'react';

const Hero = () => {
  return (
    <section className="relative h-[60vh] flex items-center justify-center text-white overflow-hidden">
      {/* Background Image Carousel Effect (Static for now) */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1711100358916-c3a93c7a47e2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="Sri Lanka Landscape" 
          className="w-full h-full object-cover transition-transform duration-1000 scale-105"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          Package Tours of Ceylon
        </h1>
        <p className="text-xl md:text-2xl font-light text-gray-200">
          Discover the soul of Sri Lanka with our curated travel experiences. 
          From misty mountains to golden beaches.
        </p>
      </div>
    </section>
  );
};

export default Hero;