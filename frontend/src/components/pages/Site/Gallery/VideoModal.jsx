// import { X, Play } from "lucide-react";

// export default function VideoModal({ isOpen, onClose }) {
//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/95 backdrop-blur-md"
//       onClick={onClose}
//     >
//       <div
//         className="relative bg-stone-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center"
//         >
//           <X className="w-5 h-5" />
//         </button>

//         {/* Video Placeholder */}
//         <div className="aspect-video bg-stone-800 flex items-center justify-center">
//           <div className="text-center">
//             <div className="w-20 h-20 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
//               <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center">
//                 <Play className="w-8 h-8 text-white fill-current ml-1" />
//               </div>
//             </div>
//             <h3 className="text-xl font-bold text-white mb-2">
//               Discover Sri Lanka
//             </h3>
//             <p className="text-stone-400 text-sm max-w-md mx-auto">
//               Experience the magic of Ceylon through our premium chauffeur-driven tours.
//               From ancient wonders to pristine beaches.
//             </p>
//             <div className="mt-6 flex items-center justify-center gap-4">
//               <div className="px-4 py-2 rounded-full bg-stone-700 text-stone-300 text-xs font-semibold">
//                 2:34 Duration
//               </div>
//               <div className="px-4 py-2 rounded-full bg-stone-700 text-stone-300 text-xs font-semibold">
//                 4K Quality
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Video Info Bar */}
//         <div className="p-6 bg-stone-900 border-t border-stone-800">
//           <div className="flex items-center justify-between">
//             <div>
//               <h4 className="text-lg font-bold text-white">
//                 LankaDrive Tour Experience
//               </h4>
//               <p className="text-stone-400 text-sm">
//                 Watch how we create unforgettable journeys
//               </p>
//             </div>
//             <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors cursor-pointer">
//               Book Your Tour
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
