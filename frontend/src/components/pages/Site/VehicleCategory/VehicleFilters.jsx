import React from 'react';
import { useTranslation } from 'react-i18next';

const VehicleFilters = ({ filters, onFilterChange, totalCount, filterOptions }) => {
    const { t } = useTranslation();
    const handleChange = (key, value) => {
        onFilterChange({ ...filters, [key]: value });
    };

    const handleReset = () => {
        onFilterChange({
            search: '',
            passenger_capacity: '',
            luggage_capacity: '',
            trip_type: '',
            comfort_level: '',
            sortBy: 'default',
        });
    };

    const hasActiveFilters =
        filters.search || filters.passenger_capacity || filters.luggage_capacity || filters.trip_type || filters.comfort_level || filters.sortBy !== 'default';

    return (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col gap-4">
                {/* Top row: Results count and Reset */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        {t("vehicleCategory.filters.showing")} <strong className="text-gray-800">{totalCount}</strong> {t("vehicleCategory.filters.vehicles")}
                    </p>
                    {hasActiveFilters && (
                        <button
                            onClick={handleReset}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {t("vehicleCategory.filters.reset")}
                        </button>
                    )}
                </div>

                {/* Filters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    {/* Search */}
                    <div className="flex flex-col gap-1.5 xl:col-span-2">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Search
                        </label>
                        <div className="relative">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search category, trip type, or best for..."
                                value={filters.search || ''}
                                onChange={(e) => handleChange('search', e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>

                    {/* Passenger Capacity */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Passenger Capacity
                        </label>
                        <select
                            value={filters.passenger_capacity || ''}
                            onChange={(e) => handleChange('passenger_capacity', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Any Capacity</option>
                            {filterOptions?.passenger_capacities?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Luggage Capacity */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Luggage Capacity
                        </label>
                        <select
                            value={filters.luggage_capacity || ''}
                            onChange={(e) => handleChange('luggage_capacity', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Any Luggage</option>
                            {filterOptions?.luggage_capacities?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Trip Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Trip Type
                        </label>
                        <select
                            value={filters.trip_type || ''}
                            onChange={(e) => handleChange('trip_type', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Any Trip Type</option>
                            {filterOptions?.trip_types?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Comfort Level */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Comfort Level
                        </label>
                        <select
                            value={filters.comfort_level || ''}
                            onChange={(e) => handleChange('comfort_level', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Any Comfort Level</option>
                            {filterOptions?.comfort_levels?.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("vehicleCategory.filters.sortBy")}
                        </label>
                        <select
                            value={filters.sortBy || 'default'}
                            onChange={(e) => handleChange('sortBy', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="default">{t("vehicleCategory.filters.sortDefault")}</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                            <option value="price_low">{t("vehicleCategory.filters.priceLowHigh")}</option>
                            <option value="price_high">{t("vehicleCategory.filters.priceHighLow")}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleFilters;