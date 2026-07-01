import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CategoryHero from './CategoryHero';
import CategoryTabs from './CategoryTabs';
import CategoryShowcase from './CategoryShowcase';
import VehicleFilters from './VehicleFilters';
import VehicleGrid from './VehicleGrid';
import VehicleDetailsModal from './VehicleDetailsModal';
import { vehicleService, categoryService } from '../../../../services/vehicleService';

const OurFleet = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    // State
    const [categories, setCategories] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    // Loading states
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [vehiclesLoading, setVehiclesLoading] = useState(true);

    // Filter state
    const [filters, setFilters] = useState({
        search: '',
        passenger_capacity: '',
        luggage_capacity: '',
        trip_type: '',
        comfort_level: '',
        sortBy: 'default',
    });

    // Toast notification
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

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
    const fetchVehicles = useCallback(async (categoryId = null) => {
        try {
            setVehiclesLoading(true);
            let response;
            if (categoryId) {
                response = await vehicleService.getByCategory(categoryId);
            } else {
                response = await vehicleService.getAll();
            }
            if (response.success) {
                const userVisibleVehicles = (response.data || []).filter((vehicle) => !vehicle.insurance_expired);
                setVehicles(userVisibleVehicles);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        } finally {
            setVehiclesLoading(false);
        }
    }, []);

    // Initial load
    useEffect(() => {
        fetchCategories();
        fetchVehicles();
    }, [fetchCategories, fetchVehicles]);

    // Handle category selection
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        fetchVehicles(category?.id);

        // Smooth scroll to vehicle list
        setTimeout(() => {
            const vehicleSection = document.getElementById('vehicles-section');
            if (vehicleSection) {
                vehicleSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    };

    // Handle view details
    const handleViewDetails = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowDetails(true);
    };

    // Handle book now
    const handleBookNow = (vehicle) => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            showToast(t("vehicleCategory.messages.pleaseLogin"), 'info');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        // Navigate to booking page with vehicle ID
        navigate(`/booking/${vehicle.id}`);
    };

    // Apply filters and sorting
    const filteredVehicles = useMemo(() => {
        let result = [...vehicles];

        // Search filter
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            result = result.filter((v) => {
                const cat = categories.find(c => c.id === v.category_id);
                return (
                    v.vehicle_name.toLowerCase().includes(searchLower) ||
                    v.brand.toLowerCase().includes(searchLower) ||
                    v.model.toLowerCase().includes(searchLower) ||
                    (cat?.name && cat.name.toLowerCase().includes(searchLower)) ||
                    (cat?.ideal_trip_types && cat.ideal_trip_types.toLowerCase().includes(searchLower)) ||
                    (cat?.best_for && cat.best_for.toLowerCase().includes(searchLower))
                );
            });
        }

        // Passenger Capacity
        if (filters.passenger_capacity) {
            const val = filters.passenger_capacity.toLowerCase();
            result = result.filter((v) => {
                const cat = categories.find(c => c.id === v.category_id);
                return (cat?.passenger_capacity && cat.passenger_capacity.toLowerCase().includes(val)) || 
                       (v.adult_seats && v.adult_seats.toString().includes(val));
            });
        }

        // Luggage Capacity
        if (filters.luggage_capacity) {
            const val = filters.luggage_capacity.toLowerCase();
            result = result.filter((v) => {
                const cat = categories.find(c => c.id === v.category_id);
                return (cat?.luggage_capacity && cat.luggage_capacity.toLowerCase().includes(val)) ||
                       (v.luggage_capacity && v.luggage_capacity.toString().includes(val));
            });
        }

        // Trip Type
        if (filters.trip_type) {
            const val = filters.trip_type.toLowerCase();
            result = result.filter((v) => {
                const cat = categories.find(c => c.id === v.category_id);
                return cat?.ideal_trip_types && cat.ideal_trip_types.toLowerCase().includes(val);
            });
        }

        // Comfort Level
        if (filters.comfort_level) {
            const val = filters.comfort_level.toLowerCase();
            result = result.filter((v) => {
                const cat = categories.find(c => c.id === v.category_id);
                return cat?.comfort_level && cat.comfort_level.toLowerCase().includes(val);
            });
        }

        // Sort
        switch (filters.sortBy) {
            case 'price_low':
                result.sort((a, b) => parseFloat(a.price_per_day) - parseFloat(b.price_per_day));
                break;
            case 'price_high':
                result.sort((a, b) => parseFloat(b.price_per_day) - parseFloat(a.price_per_day));
                break;
            case 'name_asc':
                result.sort((a, b) => a.vehicle_name.localeCompare(b.vehicle_name));
                break;
            case 'name_desc':
                result.sort((a, b) => b.vehicle_name.localeCompare(a.vehicle_name));
                break;
            default:
                break;
        }

        return result;
    }, [vehicles, filters, categories]);

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

        // Also add numeric vehicle values just in case they aren't covered by categories
        vehicles.forEach(v => {
            if (v.adult_seats) passenger.add(v.adult_seats.toString());
            if (v.luggage_capacity && typeof v.luggage_capacity === 'number') luggage.add(v.luggage_capacity.toString());
        });

        return {
            passenger_capacities: [...passenger].sort(),
            luggage_capacities: [...luggage].sort(),
            trip_types: [...tripType].sort(),
            comfort_levels: [...comfort].sort(),
        };
    }, [categories, vehicles]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toast && (
                <div className="fixed top-4 right-4 z-[60] px-6 py-3 rounded-lg shadow-lg bg-blue-500 text-white font-medium animate-slide-in">
                    {toast.message}
                </div>
            )}

            {/* Hero Section */}
            <CategoryHero />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Category Tabs */}
                <CategoryTabs
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategorySelect}
                    loading={categoriesLoading}
                />

                {/* Category Showcase (when category is selected) */}
                {selectedCategory && <CategoryShowcase category={selectedCategory} />}

                {/* Vehicles Section */}
                <div id="vehicles-section">
                    {/* Filters */}
                    <VehicleFilters
                        filters={filters}
                        onFilterChange={setFilters}
                        totalCount={filteredVehicles.length}
                        filterOptions={filterOptions}
                    />

                    {/* Section Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {selectedCategory
                                ? t("vehicleCategory.grid.categoryVehicles", { category: selectedCategory.name })
                                : t("vehicleCategory.grid.allAvailableVehicles")}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            {t("vehicleCategory.grid.choosePerfect")}
                        </p>
                    </div>

                    {/* Vehicle Grid */}
                    <VehicleGrid
                        vehicles={filteredVehicles}
                        loading={vehiclesLoading}
                        onViewDetails={handleViewDetails}
                        onBookNow={handleBookNow}
                        categoryName={selectedCategory?.name}
                    />
                </div>
            </div>

            {/* Vehicle Details Modal */}
            <VehicleDetailsModal
                isOpen={showDetails}
                onClose={() => {
                    setShowDetails(false);
                    setSelectedVehicle(null);
                }}
                vehicle={selectedVehicle}
                onBookNow={handleBookNow}
            />
        </div>
    );
};

export default OurFleet;