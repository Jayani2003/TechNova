import { motion } from "framer-motion";
const CustomizedHeader = () => {
  
  return (
  <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
    <motion.img
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      src="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=2000&auto=format&fit=crop"
      className="absolute w-full h-full object-cover"
      alt="Customized Tour Sri Lanka"
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
    <div className="relative z-10 text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-widest text-white uppercase bg-[#EF8354] rounded-full">
          {"Tailor-Made Journeys"}
        </span>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">
          {"Your Trip,"} <span className="text-[#EF8354]">{"Your Way."}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
          {"Design your dream Sri Lankan adventure. Select your favorite destinations, thrilling activities, and let us handle the rest."}
        </p>
      </motion.div>
    </div>
  </section>
  );
};

export default CustomizedHeader;
