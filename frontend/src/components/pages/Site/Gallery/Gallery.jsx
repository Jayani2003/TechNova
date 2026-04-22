import React from 'react';
import Hero from './Hero';
import GalleryGrid from './GalleryGrid';


function Gallery() {
  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans text-slate-900">
      <Hero />
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-12">
        <GalleryGrid />
      </div>
    </div>
  );
}

export default Gallery;