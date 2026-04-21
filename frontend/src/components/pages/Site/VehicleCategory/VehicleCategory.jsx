import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import CategoryHero from './CategoryHero';
import CategoryGrid from './CategoryGrid';
import CategoryModal from './CategoryModal';
import VehicleDisplay from './VehicalDisplay';

const CATEGORY_DATA = [
    {
        id: 1,
        title: 'Luxury Sedan',
        icon: '🚘',
        tagline: 'Executive comfort',
        description: 'Premium sedans for business travel, airport transfers, and city rides in style.',
        features: ['Leather interior', 'Dual-zone climate', 'Professional chauffeur']
    },
    {
        id: 2,
        title: 'SUV',
        icon: '🚙',
        tagline: 'Space and power',
        description: 'Spacious SUVs suited for family outings, long routes, and extra luggage.',
        features: ['7-seater options', 'Large cargo space', 'All-terrain support']
    },
    {
        id: 3,
        title: 'Van',
        icon: '🚐',
        tagline: 'Group mobility',
        description: 'Reliable vans for team transport, events, and comfortable group travel.',
        features: ['High roof comfort', 'Flexible seating', 'Event-ready transport']
    },
    {
        id: 4,
        title: 'Mini Car',
        icon: '🚗',
        tagline: 'City friendly',
        description: 'Compact vehicles ideal for quick city trips, easy parking, and efficient travel.',
        features: ['Fuel efficient', 'Easy parking', 'Affordable daily rates']
    }
];

const VEHICLE_INVENTORY = [
  { id: 101, categoryId: 1, name: "Mercedes-Benz E-Class", price: "120", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800", specs: { seats: 5, transmission: "Auto" } },
  { id: 102, categoryId: 1, name: "BMW 5 Series", price: "115", image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800", specs: { seats: 5, transmission: "Auto" } },
  { id: 201, categoryId: 2, name: "Range Rover Sport", price: "210", image: "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?auto=format&fit=crop&q=80&w=800", specs: { seats: 7, transmission: "4x4" } },
  { id: 301, categoryId: 3, name: "Toyota Hiace", price: "160", image: "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800", specs: { seats: 12, transmission: "Manual" } },
  { id: 401, categoryId: 4, name: "Toyota Yaris", price: "70", image: "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=800", specs: { seats: 5, transmission: "Auto" } }
];

function VehicleCategory() {
    // 'modalItem' handles the popup
    const [modalItem, setModalItem] = useState(null);
    // 'activeCategory' handles the filtered list in the background
    const [activeCategory, setActiveCategory] = useState(null);
    const resultsRef = useRef(null);

    const handleSelect = (cat) => {
        // setModalItem(cat);       // Open Modal
        setActiveCategory(cat); // Update background list
    };

    const filteredVehicles = activeCategory 
        ? VEHICLE_INVENTORY.filter(v => v.categoryId === activeCategory.id)
        : [];

    useEffect(() => {
        if (activeCategory && resultsRef.current) {
            resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [activeCategory]);

    return (
        <div className="bg-slate-50 min-h-screen selection:bg-[#00b0a5]/20">
            <CategoryHero />
            
            <CategoryGrid 
                data={CATEGORY_DATA} 
                onSelect={handleSelect} 
            />

            <div ref={resultsRef} className="pb-20">
                <AnimatePresence mode="wait">
                    {activeCategory && (
                        <VehicleDisplay 
                            key={activeCategory.id}
                            vehicles={filteredVehicles} 
                            categoryTitle={activeCategory.title} 
                        />
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {modalItem && (
                    <CategoryModal 
                        key="modal" 
                        selected={modalItem} 
                        onClose={() => setModalItem(null)} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default VehicleCategory;