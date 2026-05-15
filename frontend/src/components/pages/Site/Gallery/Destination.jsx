// import { useState } from "react";
// import { MapPin, ArrowRight, Camera, ChevronLeft, ChevronRight } from "lucide-react";
// import { PHOTOS } from "../../../data/tourData";

// export default function Destinations({ locations, onLocationClick }) {
//   const [activeIndex, setActiveIndex] = useState(0);

//   // Get photo count for each location
//   const getLocationPhotoCount = (locName) => {
//     return PHOTOS.filter((p) => p.loc === locName && p.status === "published").length;
//   };

//   // Get a sample image for each location
//   const getLocationImage = (locName) => {
//     const photo = PHOTOS.find((p) => p.loc === locName && p.status === "published");
//     return photo?.image || "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80";
//   };

//   const featuredLocations = locations.slice(0, 6);
//   const activeLocation = featuredLocations[activeIndex];

//   const nextSlide = () => {
//     setActiveIndex((prev) => (prev + 1) % featuredLocations.length);
//   };

//   const prevSlide = () => {
//     setActiveIndex((prev) => (prev - 1 + featuredLocations.length) % featuredLocations.length);
//   };

//   return (
//     <section id="destinations" className="py-20 lg:py-32 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 text-amber-700 text-sm font-semibold mb-4">
//             <MapPin className="w-4 h-4" />
//             Destinations
//           </div>
//           <h2
//             className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4"
//             style={{ fontFamily: "'Playfair Display', serif" }}
//           >
//             Explore Sri Lanka
//           </h2>
//           <p className="text-lg text-stone-600 max-w-2xl mx-auto">
//             From ancient ruins to pristine beaches, discover the diverse landscapes that make Ceylon extraordinary
//           </p>
//         </div>

//         {/* Featured Destination Hero */}
//         <div className="mb-16">
//           <div className="relative rounded-3xl overflow-hidden h-[500px] lg:h-[600px]">
//             {/* Background Image */}
//             <img
//               src={getLocationImage(activeLocation.name)}
//               alt={activeLocation.name}
//               className="w-full h-full object-cover transition-all duration-700"
//             />
            
//             {/* Gradient Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-r from-stone-900/90 via-stone-900/50 to-transparent" />

//             {/* Content */}
//             <div className="absolute inset-0 flex items-center">
//               <div className="p-8 lg:p-16 max-w-2xl">
//                 {/* Region Tag */}
//                 <div
//                   className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white mb-4"
//                   style={{ background: activeLocation.col }}
//                 >
//                   <MapPin className="w-3.5 h-3.5" />
//                   {activeLocation.region}
//                 </div>

//                 {/* Name */}
//                 <h3
//                   className="text-4xl lg:text-6xl font-bold text-white mb-4"
//                   style={{ fontFamily: "'Playfair Display', serif" }}
//                 >
//                   {activeLocation.name}
//                 </h3>

//                 {/* Description */}
//                 <p className="text-lg text-white/80 mb-6 leading-relaxed">
//                   {activeLocation.desc}
//                 </p>

//                 {/* Stats */}
//                 <div className="flex items-center gap-6 mb-8">
//                   <div className="flex items-center gap-2 text-white/60">
//                     <Camera className="w-5 h-5" />
//                     <span className="font-semibold">
//                       {getLocationPhotoCount(activeLocation.name)} Photos
//                     </span>
//                   </div>
//                   <div className="text-white/60 font-mono text-sm">
//                     {activeLocation.lat.toFixed(4)}°N, {activeLocation.lng.toFixed(4)}°E
//                   </div>
//                 </div>

//                 {/* CTA */}
//                 <button
//                   onClick={() => onLocationClick(activeLocation.name)}
//                   className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-xl font-bold hover:bg-amber-400 transition-all cursor-pointer"
//                 >
//                   View Photos
//                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
//                 </button>
//               </div>
//             </div>

//             {/* Navigation Arrows */}
//             <div className="absolute bottom-8 right-8 flex gap-3">
//               <button
//                 onClick={prevSlide}
//                 className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//               <button
//                 onClick={nextSlide}
//                 className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Slide Indicators */}
//             <div className="absolute bottom-8 left-8 lg:left-16 flex gap-2">
//               {featuredLocations.map((_, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setActiveIndex(index)}
//                   className={`h-1.5 rounded-full transition-all cursor-pointer ${
//                     activeIndex === index
//                       ? "w-8 bg-white"
//                       : "w-1.5 bg-white/40 hover:bg-white/60"
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* All Destinations Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
//           {locations.map((location) => (
//             <button
//               key={location.id}
//               onClick={() => onLocationClick(location.name)}
//               className="group relative rounded-2xl overflow-hidden aspect-square cursor-pointer"
//             >
//               {/* Image */}
//               <img
//                 src={getLocationImage(location.name)}
//                 alt={location.name}
//                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//               />
              
//               {/* Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent group-hover:from-stone-900/90 transition-all" />

//               {/* Color Accent */}
//               <div
//                 className="absolute top-3 left-3 w-3 h-3 rounded-full shadow-lg"
//                 style={{ background: location.col }}
//               />

//               {/* Content */}
//               <div className="absolute inset-x-0 bottom-0 p-4">
//                 <h4 className="text-lg font-bold text-white mb-0.5">
//                   {location.name}
//                 </h4>
//                 <p className="text-xs text-white/60 font-medium mb-2">
//                   {location.region}
//                 </p>
//                 <div className="flex items-center gap-1.5 text-white/80 text-xs font-medium">
//                   <Camera className="w-3.5 h-3.5" />
//                   <span>{getLocationPhotoCount(location.name)} photos</span>
//                 </div>
//               </div>

//               {/* Hover Arrow */}
//               <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 group-hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
//                 <ArrowRight className="w-4 h-4 text-stone-900" />
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
