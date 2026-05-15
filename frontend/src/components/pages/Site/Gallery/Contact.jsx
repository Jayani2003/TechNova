// import { useState } from "react";
// import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Car, Users, Camera, Star } from "lucide-react";

// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     destination: "",
//     travelers: "",
//     dates: "",
//     message: "",
//   });
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Simulate form submission
//     setTimeout(() => {
//       setIsSubmitted(true);
//     }, 500);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const features = [
//     {
//       icon: <Car className="w-6 h-6" />,
//       title: "Private Chauffeur",
//       desc: "Experienced English-speaking drivers",
//     },
//     {
//       icon: <Camera className="w-6 h-6" />,
//       title: "Photo Tours",
//       desc: "Perfect timing for iconic shots",
//     },
//     {
//       icon: <Users className="w-6 h-6" />,
//       title: "Local Expertise",
//       desc: "Hidden gems & authentic experiences",
//     },
//     {
//       icon: <Star className="w-6 h-6" />,
//       title: "5-Star Service",
//       desc: "Luxury vehicles & premium care",
//     },
//   ];

//   return (
//     <section id="contact" className="py-20 lg:py-32 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Section Header */}
//         <div className="text-center mb-16">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold mb-4">
//             <Phone className="w-4 h-4" />
//             Get in Touch
//           </div>
//           <h2
//             className="text-4xl lg:text-5xl font-bold text-stone-900 mb-4"
//             style={{ fontFamily: "'Playfair Display', serif" }}
//           >
//             Plan Your Journey
//           </h2>
//           <p className="text-lg text-stone-600 max-w-2xl mx-auto">
//             Let us craft the perfect Sri Lankan adventure for you. Our team is ready to create unforgettable experiences.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
//           {/* Left: Contact Info & Features */}
//           <div>
//             {/* Features Grid */}
//             <div className="grid grid-cols-2 gap-4 mb-10">
//               {features.map((feature, index) => (
//                 <div
//                   key={index}
//                   className="p-5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all"
//                 >
//                   <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
//                     {feature.icon}
//                   </div>
//                   <h4 className="text-sm font-bold text-stone-900 mb-1">
//                     {feature.title}
//                   </h4>
//                   <p className="text-xs text-stone-500">{feature.desc}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Contact Details */}
//             <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 text-white">
//               <h3
//                 className="text-2xl font-bold mb-6"
//                 style={{ fontFamily: "'Playfair Display', serif" }}
//               >
//                 Contact Details
//               </h3>

//               <div className="space-y-5">
//                 <a
//                   href="tel:+94771234567"
//                   className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
//                     <Phone className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-white/60 font-medium">Call Us</p>
//                     <p className="font-semibold">+94 77 123 4567</p>
//                   </div>
//                 </a>

//                 <a
//                   href="mailto:tours@lankadrive.com"
//                   className="flex items-center gap-4 p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
//                 >
//                   <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
//                     <Mail className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-white/60 font-medium">Email Us</p>
//                     <p className="font-semibold">tours@lankadrive.com</p>
//                   </div>
//                 </a>

//                 <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10">
//                   <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
//                     <MapPin className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-white/60 font-medium">Office</p>
//                     <p className="font-semibold">Colombo, Sri Lanka</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10">
//                   <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
//                     <Clock className="w-5 h-5" />
//                   </div>
//                   <div>
//                     <p className="text-xs text-white/60 font-medium">Available</p>
//                     <p className="font-semibold">24/7 Support</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right: Contact Form */}
//           <div>
//             <div className="bg-stone-50 rounded-3xl p-8 lg:p-10 border border-stone-200">
//               {isSubmitted ? (
//                 <div className="text-center py-12">
//                   <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
//                     <CheckCircle className="w-10 h-10 text-emerald-600" />
//                   </div>
//                   <h3
//                     className="text-2xl font-bold text-stone-900 mb-3"
//                     style={{ fontFamily: "'Playfair Display', serif" }}
//                   >
//                     Thank You!
//                   </h3>
//                   <p className="text-stone-600 mb-6">
//                     We've received your inquiry and will get back to you within 24 hours with a personalized tour proposal.
//                   </p>
//                   <button
//                     onClick={() => {
//                       setIsSubmitted(false);
//                       setFormData({
//                         name: "",
//                         email: "",
//                         phone: "",
//                         destination: "",
//                         travelers: "",
//                         dates: "",
//                         message: "",
//                       });
//                     }}
//                     className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-500 transition-colors cursor-pointer"
//                   >
//                     Send Another Inquiry
//                   </button>
//                 </div>
//               ) : (
//                 <form onSubmit={handleSubmit} className="space-y-5">
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                         Your Name *
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all"
//                         placeholder="John Smith"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                         Email *
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all"
//                         placeholder="john@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                         Phone
//                       </label>
//                       <input
//                         type="tel"
//                         name="phone"
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all"
//                         placeholder="+1 234 567 8900"
//                       />
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                         Number of Travelers
//                       </label>
//                       <select
//                         name="travelers"
//                         value={formData.travelers}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all appearance-none"
//                       >
//                         <option value="">Select...</option>
//                         <option value="1">Solo Traveler</option>
//                         <option value="2">2 People</option>
//                         <option value="3-4">3-4 People</option>
//                         <option value="5-8">5-8 People</option>
//                         <option value="9+">9+ People</option>
//                       </select>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                         Interested Destinations
//                       </label>
//                       <select
//                         name="destination"
//                         value={formData.destination}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all appearance-none"
//                       >
//                         <option value="">Select...</option>
//                         <option value="cultural">Cultural Triangle</option>
//                         <option value="beaches">Beach Destinations</option>
//                         <option value="wildlife">Wildlife Safaris</option>
//                         <option value="highlands">Hill Country</option>
//                         <option value="fullcircle">Full Circle Tour</option>
//                       </select>
//                     </div>
//                     <div>
//                       <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                         Travel Dates
//                       </label>
//                       <input
//                         type="text"
//                         name="dates"
//                         value={formData.dates}
//                         onChange={handleChange}
//                         className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all"
//                         placeholder="e.g., March 15-25, 2026"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
//                       Your Message
//                     </label>
//                     <textarea
//                       name="message"
//                       value={formData.message}
//                       onChange={handleChange}
//                       rows={4}
//                       className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-stone-800 transition-all resize-none"
//                       placeholder="Tell us about your dream Sri Lankan adventure..."
//                     />
//                   </div>

//                   <button
//                     type="submit"
//                     className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-200/50 cursor-pointer flex items-center justify-center gap-2"
//                   >
//                     <Send className="w-5 h-5" />
//                     Send Inquiry
//                   </button>

//                   <p className="text-center text-xs text-stone-500">
//                     We'll respond within 24 hours with a personalized tour proposal
//                   </p>
//                 </form>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
