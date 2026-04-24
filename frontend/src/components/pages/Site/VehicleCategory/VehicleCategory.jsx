import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CategoryHero from './CategoryHero';
import CategoryGrid from './CategoryGrid';
import VehicleDisplay from './VehicalDisplay';

const CATEGORY_DATA = [
    { id: 1, title: 'Luxury Sedan', icon: '🚘', tagline: 'Executive comfort', description: 'Premium sedans for business travel.', features: ['Leather interior', 'Professional chauffeur'] },
    { id: 2, title: 'SUV', icon: '🚙', tagline: 'Space and power', description: 'Spacious SUVs suited for family outings.', features: ['7-seater options', 'Large cargo space'] },
    { id: 3, title: 'Van', icon: '🚐', tagline: 'Group mobility', description: 'Reliable vans for team transport.', features: ['High roof comfort', 'Flexible seating'] },
    { id: 4, title: 'Mini Car', icon: '🚗', tagline: 'City friendly', description: 'Compact vehicles ideal for quick city trips.', features: ['Fuel efficient', 'Easy parking'] }
];

const VEHICLE_INVENTORY = [
    { id: 101, categoryId: 1, name: "Mercedes-Benz E-Class", price: "120", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800", specs: { seats: 5, transmission: "Auto" } },
    { id: 102, categoryId: 1, name: "BMW 5 Series", price: "115", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800", specs: { seats: 5, transmission: "Auto" } },
    { id: 201, categoryId: 2, name: "Range Rover Sport", price: "210", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800", specs: { seats: 7, transmission: "4x4" } },
    { id: 301, categoryId: 3, name: "Toyota Hiace", price: "160", image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800", specs: { seats: 12, transmission: "Manual" } },
    { id: 401, categoryId: 4, name: "Toyota Yaris", price: "70", image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800", specs: { seats: 5, transmission: "Auto" } }
];

function VehicleCategory() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (selectedCategory) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [selectedCategory]);

    const filteredVehicles = selectedCategory
        ? VEHICLE_INVENTORY.filter(v => v.categoryId === selectedCategory.id)
        : [];

    const handleBookNow = (cat) => {
        navigate('/tour-booking', {
            state: { categoryId: cat.id, categoryTitle: cat.title }
        });
    };

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-[#00b0a5]/20">
            <CategoryHero />

            <CategoryGrid
                data={CATEGORY_DATA}
                onSelect={(cat) => setSelectedCategory(cat)}
                onBookNow={handleBookNow}
            />

            {/* PROFESSIONAL POPUP OVERLAY */}
            <AnimatePresence>
                {selectedCategory && (
                    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">

                        {/* 1. High-End Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCategory(null)}
                            className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl"
                        />

                        {/* 2. Modal Window */}
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.98 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-white w-full max-w-7xl h-[94vh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-t-[2.5rem] md:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col"
                        >
                            {/* Decorative Mobile Handle */}
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 md:hidden" />

                        
                            {/* Gallery Content Area */}
                            <div className="flex-1 overflow-y-auto no-scrollbar bg-[#fcfcfc] px-6 md:px-10 py-5">
                                {filteredVehicles.length > 0 ? (
                                    <div className="max-w-6xl mx-auto mt-4">
                                        <VehicleDisplay
                                            vehicles={filteredVehicles}
                                            categoryTitle={selectedCategory.title}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-32 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                                            <span className="text-4xl opacity-20">🚘</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 tracking-tight">No Inventory Found</h3>
                                        <p className="text-slate-500 mt-2 max-w-xs mx-auto">We are currently updating our {selectedCategory.title} collection.</p>
                                    </div>
                                )}
                            </div>

                            {/* Professional Footer */}
                            <div className="px-8 py-5 border-t border-slate-100 bg-white flex justify-between items-center">
                                <span className="hidden md:inline text-xs font-medium text-slate-400 uppercase tracking-widest">
                                    Ceylon Best Tours © 2026
                                </span>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="w-full md:w-auto px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-[#00b0a5] transition-all duration-300 transform active:scale-95 shadow-lg shadow-slate-200"
                                >
                                    CLOSE GALLERY
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default VehicleCategory;