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
    const hasImage = Boolean(category.image_url);

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
                <div className="mb-2 h-14 w-14 overflow-hidden rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
                    {hasImage ? (
                        <img
                            src={category.image_url}
                            alt={category.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-4xl">{icon}</span>
                    )}
                </div>
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