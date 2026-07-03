import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CategoryHero from './CategoryHero';
import CategoryShowcase from './CategoryShowcase';
import VehicleFilters from './VehicleFilters';
import { categoryService, vehicleService } from '../../../../services/vehicleService';

const OurFleet = () => {
    // State
    const [categories, setCategories] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    // Loading states
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        passenger_capacity: '',
        luggage_capacity: '',
        trip_type: '',
        comfort_level: '',
        sortBy: 'default',
    });

    // Fetch categories
    const fetchCategories = useCallback(async () => {
        try {
            setCategoriesLoading(true);
            const response = await categoryService.getAll();
            if (response.success) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setCategoriesLoading(false);
        }
    }, []);

    // Fetch vehicles
    const fetchVehicles = useCallback(async () => {
        try {
            const response = await vehicleService.getAll();
            if (response.success) {
                const userVisibleVehicles = (response.data || []).filter((vehicle) => !vehicle.insurance_expired);
                setVehicles(userVisibleVehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchCategories();
        fetchVehicles();
    }, [fetchCategories, fetchVehicles]);



    // Filter categories based on the same filters
    const filteredCategories = useMemo(() => {
        let result = [...categories];

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter((cat) => {
                return (
                    (cat.name && cat.name.toLowerCase().includes(searchLower)) ||
                    (cat.ideal_trip_types && cat.ideal_trip_types.toLowerCase().includes(searchLower)) ||
                    (cat.best_for && cat.best_for.toLowerCase().includes(searchLower)) ||
                    (cat.description && cat.description.toLowerCase().includes(searchLower))
                );
            });
        }

        if (filters.passenger_capacity) {
            const val = filters.passenger_capacity.toLowerCase();
            result = result.filter((cat) => cat.passenger_capacity && cat.passenger_capacity.toLowerCase().includes(val));
        }

        if (filters.luggage_capacity) {
            const val = filters.luggage_capacity.toLowerCase();
            result = result.filter((cat) => cat.luggage_capacity && cat.luggage_capacity.toLowerCase().includes(val));
        }

        if (filters.trip_type) {
            const val = filters.trip_type.toLowerCase();
            result = result.filter((cat) => cat.ideal_trip_types && cat.ideal_trip_types.toLowerCase().includes(val));
        }

        if (filters.comfort_level) {
            const val = filters.comfort_level.toLowerCase();
            result = result.filter((cat) => cat.comfort_level && cat.comfort_level.toLowerCase().includes(val));
        }

        if (filters.sortBy === 'name_asc') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (filters.sortBy === 'name_desc') {
            result.sort((a, b) => b.name.localeCompare(a.name));
        }

        return result;
    }, [categories, filters]);

    // Compute unique options for filters based on current data
    const filterOptions = useMemo(() => {
        const passenger = new Set();
        const luggage = new Set();
        const tripType = new Set();
        const comfort = new Set();

        categories.forEach(cat => {
            if (cat.passenger_capacity) passenger.add(cat.passenger_capacity.trim());
            if (cat.luggage_capacity) luggage.add(cat.luggage_capacity.trim());
            if (cat.comfort_level) comfort.add(cat.comfort_level.trim());
            if (cat.ideal_trip_types) {
                cat.ideal_trip_types.split(',').forEach(t => {
                    const trimmed = t.trim();
                    if (trimmed) tripType.add(trimmed);
                });
            }
        });

        return {
            passenger_capacities: [...passenger].sort(),
            luggage_capacities: [...luggage].sort(),
            trip_types: [...tripType].sort(),
            comfort_levels: [...comfort].sort(),
        };
    }, [categories]);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Hero Section */}
            <CategoryHero />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filters */}
                <div className="mb-8">
                    <VehicleFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        totalCount={filteredCategories.length}
                        filterOptions={filterOptions}
                    />
                </div>

                {/* Category Showcase Display */}
                <div className="space-y-8">
                    {filteredCategories.map((category) => {
                        const categoryVehicles = vehicles.filter(v => v.category_id === category.id);
                        return (
                            <CategoryShowcase 
                                key={category.id} 
                                category={category} 
                                vehicles={categoryVehicles} 
                            />
                        );
                    })}
                    {filteredCategories.length === 0 && !categoriesLoading && (
                        <div className="text-center py-12 text-gray-500">
                            No categories match your selected filters.
                        </div>
                    )}
                </div>


            </div>


        </div>
    );
};

export default OurFleet;