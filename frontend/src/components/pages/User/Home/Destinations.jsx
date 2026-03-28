import React from 'react';
import { motion } from 'framer-motion';

const destinations = [
  {
    title: "Hill Country",
    description: "Explore tea plantations, waterfalls, and scenic mountain roads in Nuwara Eliya and Ella",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800", // Placeholder
  },
  {
    title: "South Coast",
    description: "Visit pristine beaches, ancient forts, and wildlife sanctuaries along the southern coastline",
    image: "https://images.unsplash.com/photo-1586611292717-f828b1ad740b?q=80&w=800", 
  },
  {
    title: "Cultural Triangle",
    description: "Discover ancient temples, historical sites, and UNESCO World Heritage locations",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800",
  }
];

const DestinationCard = ({ title, description, image, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ y: -10 }} // Subtle lift on hover
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="h-64 overflow-hidden">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 leading-relaxed text-sm lg:text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function PopularDestinations() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16 tracking-tight">
          Popular Destinations in Sri Lanka
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <DestinationCard key={index} {...dest} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}