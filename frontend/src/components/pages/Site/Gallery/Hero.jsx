import { motion } from "framer-motion";

const Hero = () => (
  <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
    <motion.img
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
      className="absolute w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent" />
    <div className="relative z-10 text-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-widest text-white uppercase bg-[#00b0a5] rounded-full">
          Premium Travel Services
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Sri Lanka <span className="text-[#00b0a5]">Redefined.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
          Curated journeys across the pearl of the Indian Ocean.
        </p>
      </motion.div>
    </div>
  </section>
);

export default Hero;