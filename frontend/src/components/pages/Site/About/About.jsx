import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, Clock, Map, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import aboutusImg from '../../../../assets/aboutus_img.jpg';

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { label: t('about.stats.yearsExperience'), value: '10+' },
    { label: t('about.stats.happyTravelers'), value: '15k+' },
    { label: t('about.stats.luxuryVehicles'), value: '50+' },
    { label: t('about.stats.expertGuides'), value: '100+' },
  ];

  const features = [
    {
      icon: <Star className="w-6 h-6" />,
      title: t('about.features.premiumQuality'),
      description: t('about.features.premiumQualityDesc')
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: t('about.features.bespokeItineraries'),
      description: t('about.features.bespokeItinerariesDesc')
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t('about.features.safeSecure'),
      description: t('about.features.safeSecureDesc')
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('about.features.support247'),
      description: t('about.features.support247Desc')
    }
  ];

  return (
    <div className="min-h-screen pb-20" style={{ background: '#f7fffe' }}>
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={aboutusImg} 
            alt="Sri Lanka landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter"
          >
            {t('about.hero.discover')} <br />
            <span className="block text-4xl md:text-7xl font-['Playfair_Display'] italic text-transparent bg-clip-text bg-gradient-to-r from-[#40e0d6] via-[#00b0a5] to-[#007a72] mt-4">
              {t('about.hero.inLuxury')}
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto"
          >
            {t('about.hero.desc')}
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-16 z-20 px-4 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#00b0a5] mb-2">{stat.value}</div>
                <div className="text-sm md:text-base font-medium text-slate-600 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-[#00b0a5] tracking-widest uppercase mb-3">{t('about.story.subtitle')}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t('about.story.title')}
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              {t('about.story.p1')}
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t('about.story.p2')}
            </p>
            <Link to="/vehicle-category">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#00b0a5] text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-[#00b0a5]/30 hover:bg-[#008f86] transition-colors"
              >
                {t('about.story.btn')}
              </motion.button>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200" 
              alt="Nine Arch Bridge Sri Lanka" 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-[#00b0a5] tracking-widest uppercase mb-3">{t('about.whyChoose.subtitle')}</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              {t('about.whyChoose.title')}
            </h3>
            <p className="text-lg text-slate-600">
              {t('about.whyChoose.desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-slate-100"
              >
                <div className="w-14 h-14 bg-[#00b0a5]/10 rounded-xl flex items-center justify-center text-[#00b0a5] mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
