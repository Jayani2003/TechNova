import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, MapPin, BadgePercent } from 'lucide-react';

const features = [
  { title: "Fully Insured", description: "All vehicles come with comprehensive insurance coverage.", icon: ShieldCheck },
  { title: "24/7 Support", description: "Round-the-clock customer service across Sri Lanka.", icon: Clock },
  { title: "Airport Pickup", description: "Free delivery to Colombo airport (BIA) and major hotels.", icon: MapPin },
  { title: "Best Rates", description: "Competitive pricing with no hidden charges.", icon: BadgePercent },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export default function FeaturesSection() {
  const brandColor = "#00b0a5";

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Why Choose <span style={{ color: brandColor }}>Ceylon Best Tours?</span>
          </motion.h2>
          <div 
            className="w-20 h-1.5 mx-auto mt-4 rounded-full" 
            style={{ backgroundColor: brandColor }}
          />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const IconTag = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ y: -12 }}
                style={{ backgroundColor: `${brandColor}0D` }} // 0D is ~5% opacity in hex
                className="relative group p-8 rounded-3xl border border-transparent transition-all duration-300 hover:bg-white hover:shadow-2xl"
              >
                {/* Icon Circle */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${brandColor}, #008a82)` }}
                >
                  <IconTag className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#00b0a5] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Number Watermark */}
                <span 
                  className="absolute top-4 right-6 text-6xl font-bold select-none opacity-10"
                  style={{ color: brandColor }}
                >
                  0{idx + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}