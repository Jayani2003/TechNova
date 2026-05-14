import React from 'react';

const VehicleFilters = ({ filters, onFilterChange, totalCount }) => {
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleReset = () => {
        onFilterChange({
            search: '',
            transmission: '',
            fuel_type: '',
            sortBy: 'default',
        });
    };

    const hasActiveFilters =
        filters.search || filters.transmission || filters.fuel_type || filters.sortBy !== 'default';

    return (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col gap-4">
                {/* Top row: Results count and Reset */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing <strong className="text-gray-800">{totalCount}</strong> vehicles
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reset Filters
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Search
                        </label>
                        <div className="relative">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search vehicles..."
                                value={filters.search}
                                onChange={(e) => handleChange('search', e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>

                    {/* Transmission Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Transmission
                        </label>
                        <select
                            value={filters.transmission}
                            onChange={(e) => handleChange('transmission', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">All transmissions</option>
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>

                    {/* Fuel Type Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Fuel Type
                        </label>
                        <select
                            value={filters.fuel_type}
                            onChange={(e) => handleChange('fuel_type', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">All fuel types</option>
                            <option value="Petrol">Petrol</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Sort By
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleChange('sortBy', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="default">Default</option>
                            <option value="price_low">Price: Low to High</option>
                            <option value="price_high">Price: High to Low</option>
                            <option value="seats_low">Seats: Low to High</option>
                            <option value="seats_high">Seats: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleFilters;