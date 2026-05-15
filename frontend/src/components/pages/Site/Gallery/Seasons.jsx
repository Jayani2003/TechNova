// import { Calendar, Sun, CloudRain, CloudSun, Waves, Mountain, TreePalm } from "lucide-react";
// import { SEASONS, EVENTS } from "../../../data/tourData";

// export default function Seasons({ onSeasonClick }) {
//   const seasonDetails = [
//     {
//       ...SEASONS[0],
//       description: "The best time for beach holidays and wildlife safaris. Clear skies and warm temperatures across the island.",
//       activities: ["Beach holidays", "Wildlife safaris", "Whale watching", "Cultural tours"],
//       icon: <Sun className="w-6 h-6" />,
//       bgImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
//     },
//     {
//       ...SEASONS[1],
//       description: "Transitional period with occasional showers. Perfect for highland adventures and tea plantation visits.",
//       activities: ["Tea estate tours", "Hiking", "Photography", "Festivals"],
//       icon: <CloudSun className="w-6 h-6" />,
//       bgImage: "https://images.unsplash.com/photo-1555899434-94d1368aa712?auto=format&fit=crop&w=800&q=80",
//     },
//     {
//       ...SEASONS[2],
//       description: "Southwest coast receives rain, but the east coast shines. Perfect for surfing at Arugam Bay.",
//       activities: ["Surfing", "East coast beaches", "Rainforest tours", "Waterfall visits"],
//       icon: <CloudRain className="w-6 h-6" />,
//       bgImage: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80",
//     },
//     {
//       ...SEASONS[3],
//       description: "Second inter-monsoon period. Great for cultural experiences and exploring the cultural triangle.",
//       activities: ["Cultural sites", "Ancient temples", "Hill country", "Photography"],
//       icon: <Waves className="w-6 h-6" />,
//       bgImage: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80",
//     },
//   ];

//   return (
//     <section id="seasons" className="py-20 lg:py-32 bg-gradient-to-b from-stone-900 to-stone-950">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-amber-400 text-sm font-semibold mb-4">
//             <Calendar className="w-4 h-4" />
//             When to Visit
//           </div>
//           <h2
//             className="text-4xl lg:text-5xl font-bold text-white mb-4"
//             style={{ fontFamily: "'Playfair Display', serif" }}
//           >
//             Sri Lanka's Seasons
//           </h2>
//           <p className="text-lg text-white/60 max-w-2xl mx-auto">
//             Every season brings unique experiences. Plan your perfect Sri Lankan adventure based on what you want to explore.
//           </p>
//         </div>

//         {/* Season Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
//           {seasonDetails.map((season) => (
//             <button
//               key={season.key}
//               onClick={() => onSeasonClick(season.key)}
//               className="group relative rounded-3xl overflow-hidden text-left cursor-pointer"
//             >
//               {/* Background Image */}
//               <div className="absolute inset-0">
//                 <img
//                   src={season.bgImage}
//                   alt={season.label}
//                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-stone-900/95 via-stone-900/80 to-stone-900/60 group-hover:from-stone-900/90 transition-all" />
//               </div>

//               {/* Content */}
//               <div className="relative p-6 lg:p-8 min-h-[280px] flex flex-col">
//                 {/* Icon & Label */}
//                 <div className="flex items-center gap-3 mb-4">
//                   <div
//                     className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
//                     style={{ background: season.color }}
//                   >
//                     {season.icon}
//                   </div>
//                   <div>
//                     <h3 className="text-xl font-bold text-white">
//                       {season.label}
//                     </h3>
//                     <p className="text-sm text-white/60 font-medium">
//                       {season.sub}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Description */}
//                 <p className="text-white/70 leading-relaxed mb-4 flex-1">
//                   {season.description}
//                 </p>

//                 {/* Activities */}
//                 <div className="flex flex-wrap gap-2">
//                   {season.activities.map((activity, i) => (
//                     <span
//                       key={i}
//                       className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/80"
//                     >
//                       {activity}
//                     </span>
//                   ))}
//                 </div>

//                 {/* Emoji Badge */}
//                 <div className="absolute top-6 right-6 text-4xl opacity-30 group-hover:opacity-60 transition-opacity">
//                   {season.icon}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//         {/* Events & Festivals */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/10">
//           <div className="text-center mb-10">
//             <h3
//               className="text-2xl lg:text-3xl font-bold text-white mb-2"
//               style={{ fontFamily: "'Playfair Display', serif" }}
//             >
//               Special Events & Festivals
//             </h3>
//             <p className="text-white/60">
//               Time your visit with Sri Lanka's most spectacular celebrations
//             </p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {EVENTS.map((event) => (
//               <div
//                 key={event.key}
//                 className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer text-center"
//               >
//                 <div className="text-4xl mb-3">{event.icon}</div>
//                 <h4 className="text-sm font-bold text-white mb-1">
//                   {event.key}
//                 </h4>
//                 <p className="text-xs text-amber-400 font-medium">
//                   {event.date}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Quick Tips */}
//         <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
//             <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
//               <Sun className="w-6 h-6 text-amber-400" />
//             </div>
//             <div>
//               <h4 className="text-lg font-bold text-white mb-1">Best Beaches</h4>
//               <p className="text-sm text-white/60">
//                 December to March offers the best conditions for southern and western beaches.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
//             <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
//               <Mountain className="w-6 h-6 text-emerald-400" />
//             </div>
//             <div>
//               <h4 className="text-lg font-bold text-white mb-1">Hill Country</h4>
//               <p className="text-sm text-white/60">
//                 Year-round destination with cooler temperatures. Best from January to April.
//               </p>
//             </div>
//           </div>

//           <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10">
//             <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
//               <TreePalm className="w-6 h-6 text-blue-400" />
//             </div>
//             <div>
//               <h4 className="text-lg font-bold text-white mb-1">Wildlife</h4>
//               <p className="text-sm text-white/60">
//                 Safari season runs from February to July with best leopard sightings in Yala.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
