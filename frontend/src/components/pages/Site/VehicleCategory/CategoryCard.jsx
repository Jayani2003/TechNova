import React from 'react';

const VehicleCard = ({ vehicle, onViewDetails, onBookNow }) => {
    const isAvailable = vehicle.status === 'Available';

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-1">
            {/* Image Section */}
            <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {vehicle.image_url ? (
                    <img
                        src={vehicle.image_url}
                        alt={vehicle.vehicle_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-7xl">🚗</span>
                    </div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-3 left-3">
                    {isAvailable ? (
                        <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            Available
                        </span>
                    ) : (
                        <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                            {vehicle.status}
                        </span>
                    )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className="bg-white/90 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full text-gray-700 shadow-md">
                        {vehicle.category_name}
                    </span>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3 bg-white rounded-xl px-4 py-2 shadow-lg">
                    <p className="text-xs text-gray-500">Starting at</p>
                    <p className="text-xl font-bold text-blue-600">
                        ${vehicle.price_per_day}
                        <span className="text-xs text-gray-500 font-normal">/day</span>
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Title */}
                <div className="mb-3">
                    <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                        {vehicle.vehicle_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {vehicle.brand} {vehicle.model} {vehicle.year && `• ${vehicle.year}`}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">👥</span>
                        <span>{vehicle.seats} Seats</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">⛽</span>
                        <span>{vehicle.fuel_type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">⚙️</span>
                        <span>{vehicle.transmission}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-lg">🧳</span>
                        <span>{vehicle.luggage_capacity} Bags</span>
                    </div>
                </div>

                {/* Quick Features */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {vehicle.air_conditioning && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
                            ❄️ A/C
                        </span>
                    )}
                    {vehicle.mileage && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200">
                            ⚡ {vehicle.mileage}
                        </span>
                    )}
                    {vehicle.color && (
                        <span className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded-full border border-gray-200">
                            🎨 {vehicle.color}
                        </span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => onViewDetails(vehicle)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
                    >
                        View Details
                    </button>
                    <button
                        onClick={() => onBookNow(vehicle)}
                        disabled={!isAvailable}
                        className={`flex-1 font-medium py-2.5 rounded-lg transition-colors text-sm ${
                            isAvailable
                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isAvailable ? 'Book Now' : 'Not Available'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;