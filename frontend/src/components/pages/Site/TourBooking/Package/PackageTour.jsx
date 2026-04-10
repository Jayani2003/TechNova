import React from 'react';
import Hero from './Hero';
import TourCard from './TourCard';

const tourData = [
  {
    id: 1,
    title: "Hill Country Majesty",
    mainImage: "https://images.unsplash.com/photo-1775479788389-76251f360d9d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "A breathtaking journey through the central highlands.",
    days: 7,
    highlights: ["Kandy", "Ella", "Nuwara Eliya"],
    detailedPlaces: [
      { name: "Temple of the Tooth", desc: "A sacred Buddhist site in the heart of Kandy.", image: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { name: "Nine Arch Bridge", desc: "The iconic colonial-era railway bridge in Ella.", image: "https://images.unsplash.com/photo-1550679193-d8ec2f2c3a25?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { name: "Tea Plantations", desc: "Lush green fields where the world's finest Ceylon tea is born.", image: "https://plus.unsplash.com/premium_photo-1697730430306-7c8d36cb3722?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ]
  },
  {
    id: 2,
    title: "Coastal Explorer",
    mainImage: "https://images.unsplash.com/photo-1729180801603-e621887a6eae?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Sun, sand, and history along the Southern coast.",
    days: 14,
    highlights: ["Galle Fort", "Mirissa", "Yala"],
    detailedPlaces: [
      { name: "Galle Dutch Fort", desc: "A UNESCO World Heritage site with cobbled streets.", image: "https://images.unsplash.com/photo-1734279135096-2854a06faba8?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { name: "Mirissa Beach", desc: "The best spot for whale watching and relaxation.", image: "https://images.unsplash.com/photo-1580910531902-1112518b26ea?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { name: "Yala National Park", desc: "Thrilling safaris to spot leopards and elephants.", image: "https://images.unsplash.com/photo-1661768508643-e260f6f8e06c?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
    ]
  }
];

const PackageTour = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Hero />
      
      <main className="max-w-7xl mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Signature Packages</h2>
          <div className="w-24 h-1 bg-[#ee9b00] mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tourData.map(tour => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default PackageTour;