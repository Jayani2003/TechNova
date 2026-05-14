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

const CategoryTabs = ({ categories, selectedCategory, onCategorySelect, loading }) => {
    if (loading) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-2">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="animate-pulse bg-gray-200 rounded-2xl min-w-[140px] h-32"
                    ></div>
                ))}
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Browse by Category
                </h2>
                <p className="text-sm text-gray-500 hidden md:block">
                    Click any category to see vehicles
                </p>
            </div>

            {/* Categories - Scrollable on mobile, grid on desktop */}
            <div className="flex gap-3 overflow-x-auto pb-3 md:grid md:grid-cols-4 lg:grid-cols-9 md:overflow-visible">
                {/* All Vehicles Tab */}
                <button
                    onClick={() => onCategorySelect(null)}
                    className={`flex-shrink-0 min-w-[140px] md:min-w-0 rounded-2xl p-4 transition-all duration-300 transform hover:-translate-y-1 ${
                        !selectedCategory
                            ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl scale-105'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md'
                    }`}
                >
                    <div className="flex flex-col items-center text-center">
                        <span className="text-4xl mb-2">📋</span>
                        <h3 className="font-bold text-sm">All</h3>
                        <p className={`text-xs mt-1 ${!selectedCategory ? 'text-blue-100' : 'text-gray-500'}`}>
                            View All
                        </p>
                    </div>
                </button>

                {categories.map((category) => {
                    const isSelected = selectedCategory?.id === category.id;
                    const icon = categoryIcons[category.name] || '🚗';

                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategorySelect(category)}
                            className={`flex-shrink-0 min-w-[140px] md:min-w-0 rounded-2xl p-4 transition-all duration-300 transform hover:-translate-y-1 ${
                                isSelected
                                    ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl scale-105'
                                    : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:shadow-md'
                            }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <span className="text-4xl mb-2">{icon}</span>
                                <h3 className="font-bold text-sm">{category.name}</h3>
                                <p className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {category.vehicle_count || 0} vehicles
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryTabs;