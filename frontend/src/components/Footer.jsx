import React from 'react';
import {
    Mail,
    Phone,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    ChevronRight,
    ShieldCheck
} from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#111111] text-gray-400 font-sans border-t border-white/5">
            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                {/* Brand Identity */}
                <div className="space-y-6">
                    <div className="flex flex-col">
                        <span className="text-3xl font-serif font-bold text-white tracking-wider uppercase">CEYLON</span>
                        <span className="text-[#4ade80] font-medium italic text-lg leading-tight -mt-1">Best Tours</span>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-500 italic border-l border-[#4ade80]/30 pl-4">
                        "Explore the paradise island with unmatched elegance. From luxury sedans to rugged SUVs, we move your dreams."
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                            <a key={i} href="#" className="!text-gray-500 hover:!text-[#07913a] transition-colors duration-300">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Explore Links */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.22em] border-b border-white/10 pb-3">
                        Discover
                    </h4>
                    <ul className="space-y-3">
                        {['Home', 'Vehicle Category', 'Tour Packages', 'Gallery', 'Reviews'].map((item) => (
                            <li key={item}>
                                <a
                                    href="#"
                                    className="!text-white hover:!text-white visited:!text-white flex items-center group text-sm transition-colors duration-300"
                                >
                                    <ChevronRight
                                        size={14}
                                        className="mr-2 text-[#4ade80] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"
                                    />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Customer Care */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-xs uppercase tracking-[0.22em] border-b border-white/10 pb-3">Client Support</h4>
                    <ul className="space-y-3">
                        {['About Us', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'FAQ'].map((item) => (
                            <li key={item}>
                                <a href="#" className="!text-white hover:!text-white visited:!text-white flex items-center group text-sm transition-colors">
                                    <ChevronRight size={14} className="mr-2 text-[#4ade80] opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-widest">Get In Touch</h4>
                    <div className="space-y-4 text-sm">
                        <div className="flex items-start gap-3">
                            <MapPin className="text-[#4ade80] shrink-0" size={18} />
                            <p className="text-white">No 45, Galle Road, Colombo 03, Sri Lanka</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="text-[#4ade80] shrink-0" size={18} />
                            <p className="text-white">+94 11 234 5678</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="text-[#4ade80] shrink-0" size={18} />
                            <p className="text-white">info@ceylonbesttours.lk</p>
                        </div>
                        <div className="pt-4 flex items-center gap-2 text-[#4ade80]/80 font-semibold">
                            <ShieldCheck size={18} />
                            <span className="text-[10px] uppercase tracking-tighter text-gray-500">SLTDA Registered Agency</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-white/5 py-8 bg-black/20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                        © {currentYear} Ceylon Best Tours. Created by TechNova Team.
                    </p>
                    
                </div>
            </div>
        </footer>
    );
};

export default Footer;