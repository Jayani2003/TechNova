import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryHero from './CategoryHero';
import CategoryTabs from './CategoryTabs';
import CategoryShowcase from './CategoryShowcase';
import VehicleFilters from './VehicleFilters';
import VehicleGrid from './VehicleGrid';
import VehicleDetailsModal from './VehicleDetailsModal';
import { vehicleService, categoryService } from '../../../../services/vehicleService';

const OurFleet = () => {
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
        transmission: '',
        fuel_type: '',
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
            showToast('Please login to book a vehicle', 'info');
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
            result = result.filter(
                (v) =>
                    v.vehicle_name.toLowerCase().includes(searchLower) ||
                    v.brand.toLowerCase().includes(searchLower) ||
                    v.model.toLowerCase().includes(searchLower)
            );
        }

        // Transmission filter
        if (filters.transmission) {
            result = result.filter((v) => v.transmission === filters.transmission);
        }

        // Fuel type filter
        if (filters.fuel_type) {
            result = result.filter((v) => v.fuel_type === filters.fuel_type);
        }

        // Sort
        switch (filters.sortBy) {
            case 'price_low':
                result.sort((a, b) => parseFloat(a.price_per_day) - parseFloat(b.price_per_day));
                break;
            case 'price_high':
                result.sort((a, b) => parseFloat(b.price_per_day) - parseFloat(a.price_per_day));
                break;
            case 'seats_low':
                result.sort((a, b) => a.seats - b.seats);
                break;
            case 'seats_high':
                result.sort((a, b) => b.seats - a.seats);
                break;
            default:
                break;
        }

        return result;
    }, [vehicles, filters]);

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
                    />

                    {/* Section Title */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {selectedCategory
                                ? `${selectedCategory.name} Vehicles`
                                : 'All Available Vehicles'}
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Choose the perfect vehicle for your journey
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