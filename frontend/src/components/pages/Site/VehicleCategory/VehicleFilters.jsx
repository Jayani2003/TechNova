import React from 'react';
import { useTranslation } from 'react-i18next';

const VehicleFilters = ({ filters, onFilterChange, totalCount }) => {
    const { t } = useTranslation();
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

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Search */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("vehicleCategory.filters.search")}
                        </label>
                        <div className="relative">
                            <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder={t("vehicleCategory.filters.searchPlaceholder")}
                                value={filters.search}
                                onChange={(e) => handleChange('search', e.target.value)}
                                className="h-11 w-full rounded-lg border border-gray-300 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        </div>
                    </div>

                    {/* Transmission Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("vehicleCategory.filters.transmission")}
                        </label>
                        <select
                            value={filters.transmission}
                            onChange={(e) => handleChange('transmission', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">{t("vehicleCategory.filters.allTransmissions")}</option>
                            <option value="Automatic">{t("vehicleCategory.filters.automatic")}</option>
                            <option value="Manual">{t("vehicleCategory.filters.manual")}</option>
                        </select>
                    </div>

                    {/* Fuel Type Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("vehicleCategory.filters.fuelType")}
                        </label>
                        <select
                            value={filters.fuel_type}
                            onChange={(e) => handleChange('fuel_type', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">{t("vehicleCategory.filters.allFuelTypes")}</option>
                            <option value="Petrol">{t("vehicleCategory.filters.petrol")}</option>
                            <option value="Diesel">{t("vehicleCategory.filters.diesel")}</option>
                            <option value="Electric">{t("vehicleCategory.filters.electric")}</option>
                            <option value="Hybrid">{t("vehicleCategory.filters.hybrid")}</option>
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="flex flex-col gap-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("vehicleCategory.filters.sortBy")}
                        </label>
                        <select
                            value={filters.sortBy}
                            onChange={(e) => handleChange('sortBy', e.target.value)}
                            className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm text-gray-900 font-medium focus:border-blue-500 focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="default">{t("vehicleCategory.filters.sortDefault")}</option>
                            <option value="price_low">{t("vehicleCategory.filters.priceLowHigh")}</option>
                            <option value="price_high">{t("vehicleCategory.filters.priceHighLow")}</option>
                            <option value="seats_low">{t("vehicleCategory.filters.seatsLowHigh")}</option>
                            <option value="seats_high">{t("vehicleCategory.filters.seatsHighLow")}</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleFilters;