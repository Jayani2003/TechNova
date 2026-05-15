// import { useState, useEffect } from "react";
// import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

// const testimonials = [
//   {
//     id: 1,
//     name: "Sarah & James Thompson",
//     location: "London, UK",
//     avatar: "S",
//     rating: 5,
//     tour: "10-Day Full Circle Tour",
//     destination: "Sigiriya, Kandy, Ella, Galle",
//     text: "Absolutely incredible experience! Our driver Kasun was not just a driver but became our friend and guide. His knowledge of Sri Lanka's history and hidden gems made our honeymoon unforgettable. The sunrise at Sigiriya was magical!",
//     image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 2,
//     name: "The Anderson Family",
//     location: "Sydney, Australia",
//     avatar: "A",
//     rating: 5,
//     tour: "7-Day Family Adventure",
//     destination: "Pinnawala, Kandy, Nuwara Eliya",
//     text: "Traveling with kids can be challenging, but LankaDrive made it seamless. The air-conditioned SUV was perfect for our family of five, and our driver always knew the best spots for kid-friendly activities. The elephant orphanage was a highlight!",
//     image: "https://images.unsplash.com/photo-1585938338392-50a59910d6e5?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 3,
//     name: "Marco & Elena Rossi",
//     location: "Milan, Italy",
//     avatar: "M",
//     rating: 5,
//     tour: "5-Day Wildlife Safari",
//     destination: "Yala, Udawalawe, Mirissa",
//     text: "As wildlife photographers, we needed a driver who understood timing and patience. Our driver knew exactly where to position us for the best leopard sightings in Yala. We got shots we never dreamed of. Highly recommend!",
//     image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 4,
//     name: "Hiroshi & Yuki Tanaka",
//     location: "Tokyo, Japan",
//     avatar: "H",
//     rating: 5,
//     tour: "8-Day Tea Country Tour",
//     destination: "Nuwara Eliya, Ella, Haputale",
//     text: "The tea plantations reminded us of home but with such a different character. Our driver arranged private tea factory tours and we even met local tea pluckers. The train ride through the hills was breathtaking. Perfect planning!",
//     image: "https://images.unsplash.com/photo-1555899434-94d1368aa712?auto=format&fit=crop&w=400&q=80",
//   },
// ];

// export default function Testimonials() {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   useEffect(() => {
//     if (!isAutoPlaying) return;
//     const timer = setInterval(() => {
//       setActiveIndex((prev) => (prev + 1) % testimonials.length);
//     }, 5000);
//     return () => clearInterval(timer);
//   }, [isAutoPlaying]);

//   const nextSlide = () => {
//     setIsAutoPlaying(false);
//     setActiveIndex((prev) => (prev + 1) % testimonials.length);
//   };

//   const prevSlide = () => {
//     setIsAutoPlaying(false);
//     setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
//   };

//   const activeTestimonial = testimonials[activeIndex];

//   return (
//     <section className="py-20 lg:py-32 bg-stone-50 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold mb-4">
//             <Star className="w-4 h-4 fill-current" />
//             Testimonials
//           </div>
//           <h2
//             className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4"
//             style={{ fontFamily: "'Playfair Display', serif" }}
//           >
//             Traveler Stories
//           </h2>
//           <p className="text-lg text-stone-600 max-w-2xl mx-auto">
//             Real experiences from real travelers who discovered Sri Lanka with us
//           </p>
//         </div>

//         {/* Main Testimonial Card */}
//         <div className="relative max-w-5xl mx-auto">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden">
//             {/* Image Side */}
//             <div className="relative h-[300px] lg:h-[500px]">
//               <img
//                 src={activeTestimonial.image}
//                 alt={activeTestimonial.destination}
//                 className="w-full h-full object-cover transition-all duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent" />
//               <div className="absolute bottom-6 left-6 right-6">
//                 <div className="flex items-center gap-2 text-white/90 mb-1">
//                   <MapPin className="w-4 h-4" />
//                   <span className="text-sm font-semibold">{activeTestimonial.destination}</span>
//                 </div>
//                 <span className="text-xs text-white/70 font-medium">{activeTestimonial.tour}</span>
//               </div>
//             </div>

//             {/* Content Side */}
//             <div className="p-8 lg:p-12">
//               {/* Quote Icon */}
//               <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
//                 <Quote className="w-6 h-6" />
//               </div>

//               {/* Rating */}
//               <div className="flex gap-1 mb-4">
//                 {[...Array(activeTestimonial.rating)].map((_, i) => (
//                   <Star
//                     key={i}
//                     className="w-5 h-5 text-amber-400 fill-current"
//                   />
//                 ))}
//               </div>

//               {/* Quote Text */}
//               <p className="text-stone-700 text-lg leading-relaxed mb-8 italic">
//                 "{activeTestimonial.text}"
//               </p>

//               {/* Author Info */}
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center font-bold text-xl">
//                   {activeTestimonial.avatar}
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-bold text-stone-900">
//                     {activeTestimonial.name}
//                   </h4>
//                   <p className="text-stone-500 text-sm">
//                     {activeTestimonial.location}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Navigation Arrows */}
//           <button
//             onClick={prevSlide}
//             className="absolute left-4 lg:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg text-stone-700 hover:text-emerald-600 hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
//           >
//             <ChevronLeft className="w-6 h-6" />
//           </button>
//           <button
//             onClick={nextSlide}
//             className="absolute right-4 lg:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg text-stone-700 hover:text-emerald-600 hover:scale-110 transition-all flex items-center justify-center cursor-pointer"
//           >
//             <ChevronRight className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Slide Indicators */}
//         <div className="flex justify-center gap-3 mt-8">
//           {testimonials.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => {
//                 setIsAutoPlaying(false);
//                 setActiveIndex(index);
//               }}
//               className={`h-2 rounded-full transition-all cursor-pointer ${
//                 activeIndex === index
//                   ? "w-8 bg-emerald-600"
//                   : "w-2 bg-stone-300 hover:bg-stone-400"
//               }`}
//             />
//           ))}
//         </div>

//         {/* Trust Badges */}
//         <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
//           <div className="p-6 rounded-2xl bg-white border border-stone-200">
//             <div className="text-3xl font-bold text-emerald-600 mb-1">4.9/5</div>
//             <div className="text-sm text-stone-500 font-medium">Average Rating</div>
//             <div className="flex justify-center gap-0.5 mt-2">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
//               ))}
//             </div>
//           </div>
//           <div className="p-6 rounded-2xl bg-white border border-stone-200">
//             <div className="text-3xl font-bold text-emerald-600 mb-1">500+</div>
//             <div className="text-sm text-stone-500 font-medium">5-Star Reviews</div>
//           </div>
//           <div className="p-6 rounded-2xl bg-white border border-stone-200">
//             <div className="text-3xl font-bold text-emerald-600 mb-1">98%</div>
//             <div className="text-sm text-stone-500 font-medium">Would Recommend</div>
//           </div>
//           <div className="p-6 rounded-2xl bg-white border border-stone-200">
//             <div className="text-3xl font-bold text-emerald-600 mb-1">2000+</div>
//             <div className="text-sm text-stone-500 font-medium">Happy Travelers</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
