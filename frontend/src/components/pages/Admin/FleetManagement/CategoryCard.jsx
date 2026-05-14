import React from 'react';

const categoryIcons = {
    'Mini Car': '🚗',
    'Normal Car': '🚙',
    'Sedan Car': '🚘',
    'MPV': '🚐',
    'SUV': '🏎️',
    'Mini Van': '🚌',
    'Van': '🚍',
    'Large Van': '🚛',
};

const CategoryCard = ({ category, isSelected, onClick }) => {
    const icon = categoryIcons[category.name] || '🚗';

    return (
        <div
            onClick={() => onClick(category)}
            className={`cursor-pointer rounded-xl p-4 border-2 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${
                isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300'
            }`}
        >
            <div className="flex flex-col items-center text-center">
                <div className="text-4xl mb-2">{icon}</div>
                <h3
                    className={`font-semibold text-sm ${
                        isSelected ? 'text-blue-700' : 'text-gray-700'
                    }`}
                >
                    {category.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                    {category.vehicle_count || 0} vehicles
                </p>
            </div>
        </div>
    );
};

export default CategoryCard;