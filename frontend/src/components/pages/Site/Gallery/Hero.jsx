// import { useState, useEffect } from "react";
// import { ChevronDown, Play, MapPin, Star, Users } from "lucide-react";

// const heroImages = [
//   {
//     url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1920&q=80",
//     title: "Sigiriya Rock Fortress",
//     subtitle: "The Eighth Wonder of the World",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1920&q=80",
//     title: "Temple of the Tooth",
//     subtitle: "Sacred Heritage of Kandy",
//   },
//   {
//     url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80",
//     title: "Pristine Beaches",
//     subtitle: "Tropical Paradise Awaits",
//   },
// ];

// export default function Hero({ onExplore, onWatchVideo }) {
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//     const timer = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % heroImages.length);
//     }, 6000);
//     return () => clearInterval(timer);
//   }, []);

//   const stats = [
//     { icon: <MapPin className="w-5 h-5" />, value: "12+", label: "Destinations" },
//     { icon: <Star className="w-5 h-5" />, value: "500+", label: "Tours Completed" },
//     { icon: <Users className="w-5 h-5" />, value: "2000+", label: "Happy Travelers" },
//   ];

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background Slideshow */}
//       <div className="absolute inset-0">
//         {heroImages.map((img, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-1000 ${
//               currentSlide === index ? "opacity-100" : "opacity-0"
//             }`}
//           >
//             <img
//               src={img.url}
//               alt={img.title}
//               className="w-full h-full object-cover scale-105"
//             />
//           </div>
//         ))}
//         {/* Gradient Overlays */}
//         <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/40 to-stone-900/80" />
//         <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 to-transparent" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//         <div
//           className={`transition-all duration-1000 delay-300 ${
//             isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
//           }`}
//         >
//           {/* Badge */}
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium mb-8">
//             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//             Premium Chauffeur-Driven Tours
//           </div>

//           {/* Main Heading */}
//           <h1
//             className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
//             style={{ fontFamily: "'Playfair Display', serif" }}
//           >
//             Discover the
//             <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
//               Pearl of the
//             </span>
//             <span className="block">Indian Ocean</span>
//           </h1>

//           {/* Subtitle */}
//           <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
//             Experience Sri Lanka's ancient wonders, pristine beaches, and lush
//             highlands with our expert local drivers. Every journey tells a story.
//           </p>

//           {/* CTA Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
//             <button
//               onClick={onExplore}
//               className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl shadow-emerald-900/30 hover:shadow-emerald-700/40 hover:scale-105 cursor-pointer flex items-center gap-2"
//             >
//               Explore Gallery
//               <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
//             </button>
//             <button
//               onClick={onWatchVideo}
//               className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl text-lg font-semibold transition-all duration-300 border border-white/30 cursor-pointer flex items-center gap-3"
//             >
//               <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
//                 <Play className="w-4 h-4 fill-current ml-0.5" />
//               </div>
//               Watch Video
//             </button>
//           </div>

//           {/* Stats Bar */}
//           <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
//             {stats.map((stat, index) => (
//               <div
//                 key={index}
//                 className="flex items-center gap-3 text-white/90"
//               >
//                 <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm">
//                   {stat.icon}
//                 </div>
//                 <div className="text-left">
//                   <div className="text-2xl font-bold">{stat.value}</div>
//                   <div className="text-xs text-white/60 font-medium">
//                     {stat.label}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Slide Indicators */}
//       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
//         {heroImages.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`transition-all duration-300 cursor-pointer rounded-full ${
//               currentSlide === index
//                 ? "w-8 h-2 bg-white"
//                 : "w-2 h-2 bg-white/40 hover:bg-white/60"
//             }`}
//           />
//         ))}
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/60">
//         <span className="text-xs font-medium tracking-widest uppercase rotate-90 origin-center translate-y-8">
//           Scroll
//         </span>
//         <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent mt-10" />
//       </div>

//       {/* Current Slide Info */}
//       <div className="absolute bottom-8 left-8 hidden lg:block">
//         <div className="text-white/60 text-xs font-medium uppercase tracking-widest mb-1">
//           Featured Location
//         </div>
//         <div className="text-white text-lg font-bold">
//           {heroImages[currentSlide].title}
//         </div>
//         <div className="text-white/60 text-sm">
//           {heroImages[currentSlide].subtitle}
//         </div>
//       </div>
//     </section>
//   );
// }
