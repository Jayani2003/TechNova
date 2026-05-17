import React from 'react';

const categoryDescriptions = {
    'Mini Car': {
        icon: '🚗',
        description: 'Perfect for city driving and tight parking spaces. Fuel-efficient and easy to maneuver.',
        bestFor: 'Solo travelers, couples, city tours',
    },
    'Normal Car': {
        icon: '🚙',
        description: 'Reliable and comfortable cars perfect for everyday use and small group travel.',
        bestFor: 'Small families, business trips',
    },
    'Sedan Car': {
        icon: '🚘',
        description: 'Premium comfort with spacious interiors and elegant design for executive travel.',
        bestFor: 'Business meetings, airport transfers',
    },
    'MPV': {
        icon: '🚐',
        description: 'Multi-Purpose Vehicles offering versatility, space, and comfort for groups.',
        bestFor: 'Family trips, group tours',
    },
    'SUV': {
        icon: '🏎️',
        description: 'Powerful and rugged vehicles ideal for adventure trips and off-road exploration.',
        bestFor: 'Adventure trips, hill stations',
    },
    'Mini Van': {
        icon: '🚌',
        description: 'Compact vans perfect for small groups needing extra space and comfort.',
        bestFor: 'Small group tours, family vacations',
    },
    'Van': {
        icon: '🚍',
        description: 'Spacious vans ideal for medium-sized groups and luggage-heavy trips.',
        bestFor: 'Group tours, wedding parties',
    },
    'Large Van': {
        icon: '🚛',
        description: 'Maximum capacity vans for large groups and extensive cargo transportation.',
        bestFor: 'Large groups, corporate events',
    },
};

const CategoryShowcase = ({ category }) => {
    if (!category) return null;

    const info = categoryDescriptions[category.name] || {
        icon: '🚗',
        description: category.description || 'Quality vehicles for your journey.',
        bestFor: 'All travelers',
    };

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="h-28 w-28 md:h-32 md:w-32 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm flex items-center justify-center">
                    {category.image_url ? (
                        <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="text-7xl md:text-8xl">{info.icon}</div>
                    )}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        {category.name}
                    </h2>
                    <p className="text-gray-600 mb-3">{info.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="bg-white px-3 py-1.5 rounded-full text-sm border border-blue-200 text-blue-700">
                            ✨ Best for: {info.bestFor}
                        </span>
                        <span className="bg-white px-3 py-1.5 rounded-full text-sm border border-green-200 text-green-700">
                            🚗 {category.vehicle_count || 0} Available
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryShowcase;