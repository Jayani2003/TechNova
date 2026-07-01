import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FeatureBadge from './FeatureBadge';

const formatDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const VehicleDetailsModal = ({ isOpen, onClose, vehicle, onBookNow }) => {
    const { t } = useTranslation();
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    if (!isOpen || !vehicle) return null;

    const isAvailable = vehicle.status === 'Available';
    const features = vehicle.features
        ? vehicle.features.split(',').map((f) => f.trim()).filter(Boolean)
        : [];

    return (
        <>
            <style>{`
                .modal-hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .modal-hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 overflow-hidden p-6 md:p-8 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 ring-1 ring-black/5 w-full max-w-3xl max-h-[calc(100vh-3rem)] overflow-y-auto modal-hide-scrollbar">
                {/* Image Header */}
                <div className="relative h-56 md:h-72 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-t-2xl">
                    {vehicle.image_url ? (
                        <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6">
                            <img
                                src={vehicle.image_url}
                                alt={vehicle.vehicle_name}
                                className="max-h-full max-w-full object-contain object-center drop-shadow-lg"
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-9xl">🚗</span>
                        </div>
                    )}

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Bottom info bar */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5 md:p-6">
                        <div className="flex items-end justify-between">
                            <div>
                                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full mb-2 inline-block">
                                    {vehicle.category_name}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">
                                    {vehicle.vehicle_name}
                                </h2>
                                <p className="text-white/80">
                                    {vehicle.brand} {vehicle.model} {vehicle.year && `• ${vehicle.year}`}
                                </p>
                            </div>
                            {isAvailable ? (
                                <span className="bg-green-500 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    {t("vehicleCategory.card.available")}
                                </span>
                            ) : (
                                <span className="bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full">
                                    {vehicle.status}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                    {/* Price Section */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-500">{t("vehicleCategory.modal.dailyRentalPrice")}</p>
                                <p className="text-4xl font-bold text-blue-600">
                                    ${vehicle.price_per_day}
                                    <span className="text-lg text-gray-500 font-normal">{t("vehicleCategory.card.perDay")}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => onBookNow(vehicle)}
                                disabled={!isAvailable}
                                className={`px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all ${
                                    isAvailable
                                        ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isAvailable ? t("vehicleCategory.modal.bookThisVehicle") : t("vehicleCategory.card.notAvailable")}
                            </button>
                        </div>
                    </div>

                    {/* Quick Features */}
                    <div className="mb-5">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">
                            {t("vehicleCategory.modal.vehicleSpecs")}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <FeatureBadge icon="👥" label={t("vehicleCategory.card.seats", { count: '' }).trim()} value={vehicle.seats} />
                            <FeatureBadge icon="⛽" label={t("vehicleCategory.filters.fuelType")} value={vehicle.fuel_type} />
                            <FeatureBadge icon="⚙️" label={t("vehicleCategory.filters.transmission")} value={vehicle.transmission} />
                            <FeatureBadge icon="🧳" label={t("vehicleCategory.card.bags", { count: '' }).trim()} value={`${vehicle.luggage_capacity} ${t("vehicleCategory.card.bags", { count: '' }).trim()}`} />
                        </div>
                    </div>

                    {/* Detailed Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                {t("vehicleCategory.modal.vehicleDetails")}
                            </h3>
                            <div className="bg-gray-50 rounded-xl divide-y divide-gray-200 border border-gray-200 overflow-hidden">
                                {[
                                    { label: t("vehicleCategory.modal.brand"), value: vehicle.brand },
                                    { label: t("vehicleCategory.modal.model"), value: vehicle.model },
                                    { label: t("vehicleCategory.modal.year"), value: vehicle.year || 'N/A' },
                                    { label: t("vehicleCategory.modal.color"), value: vehicle.color || 'N/A' },
                                    { label: t("vehicleCategory.modal.license"), value: vehicle.vehicle_license || 'N/A' },
                                    { label: t("vehicleCategory.modal.engine"), value: vehicle.engine_capacity || 'N/A' },
                                    { label: t("vehicleCategory.modal.mileage"), value: vehicle.mileage || 'N/A' },
                                    { label: t("vehicleCategory.modal.insurance"), value: vehicle.insurance_provider || 'N/A' },
                                    { label: t("vehicleCategory.modal.insuranceStart"), value: formatDate(vehicle.insurance_start_date) },
                                    { label: t("vehicleCategory.modal.insuranceEnd"), value: formatDate(vehicle.insurance_end_date) },
                                    { label: t("vehicleCategory.modal.insuranceStatus"), value: vehicle.insurance_expired ? t("vehicleCategory.modal.expired") : t("vehicleCategory.modal.valid") },
                                ].map((item, index) => (
                                    <div key={index} className="flex justify-between items-center px-4 py-2">
                                        <span className="text-sm text-gray-500">{item.label}</span>
                                        <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                {t("vehicleCategory.modal.comfortConv")}
                            </h3>
                            <div className="space-y-3">
                                {vehicle.air_conditioning && (
                                        <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                        <span className="text-2xl">❄️</span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{t("vehicleCategory.modal.airCond")}</p>
                                            <p className="text-xs text-gray-500">{t("vehicleCategory.modal.climateControl")}</p>
                                        </div>
                                    </div>
                                )}
                                <div className={`flex items-center gap-3 rounded-lg p-3 border ${vehicle.insurance_expired ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                    <span className="text-2xl">{vehicle.insurance_expired ? '⚠️' : '✅'}</span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{vehicle.insurance_expired ? t("vehicleCategory.card.insuranceExpired") : t("vehicleCategory.modal.fullyInsured")}</p>
                                        <p className="text-xs text-gray-500">{vehicle.insurance_expired ? t("vehicleCategory.modal.renewalReq") : t("vehicleCategory.modal.compCoverage")}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3 border border-purple-100">
                                    <span className="text-2xl">🛟</span>
                                    <div>
                                        <p className="font-semibold text-gray-800">{t("vehicleCategory.modal.support")}</p>
                                        <p className="text-xs text-gray-500">{t("vehicleCategory.modal.roadside")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    {features.length > 0 && (
                        <div className="mb-5">
                            <h3 className="text-lg font-bold text-gray-800 mb-3">
                                {t("vehicleCategory.modal.addFeatures")}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {features.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="bg-blue-50 text-blue-700 text-sm font-medium px-4 py-2 rounded-full border border-blue-200"
                                    >
                                        ✓ {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-2.5 font-medium rounded-xl transition-colors"
                            style={{ backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db' }}
                        >
                            {t("vehicleCategory.modal.close")}
                        </button>
                        <button
                            onClick={() => onBookNow(vehicle)}
                            disabled={!isAvailable}
                            className="flex-1 px-6 py-2.5 rounded-xl font-medium transition-all"
                            style={isAvailable 
                                ? { backgroundColor: '#ffffff', color: '#6dced4', border: '1px solid #93c5fd', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
                                : { backgroundColor: '#ffffff', color: '#9ca3af', cursor: 'not-allowed', border: '1px solid #d1d5db' }
                            }
                        >
                            {isAvailable ? t("vehicleCategory.modal.bookThisVehicle") : t("vehicleCategory.card.notAvailable")}
                        </button>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
};

export default VehicleDetailsModal;