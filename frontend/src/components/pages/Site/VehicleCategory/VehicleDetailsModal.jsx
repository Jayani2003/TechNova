import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FeatureBadge from './FeatureBadge';

const VehicleDetailsModal = ({ isOpen, onClose, vehicle }) => {
    const { t } = useTranslation();
    const [currentImageIdx, setCurrentImageIdx] = useState(0);
    const images = vehicle?.images && vehicle.images.length > 0 ? vehicle.images : (vehicle?.image_url ? [vehicle.image_url] : []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setCurrentImageIdx(0);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentImageIdx((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [isOpen, images.length]);

    if (!isOpen || !vehicle) return null;

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
                    <div className="relative h-56 md:h-72 bg-gradient-to-br from-blue-100 to-blue-200 overflow-hidden rounded-t-2xl group">
                        {images.length > 0 ? (
                            <div className="absolute inset-0 flex items-center justify-center p-4 md:p-6 transition-opacity duration-500">
                                <img
                                    src={images[currentImageIdx]}
                                    alt={vehicle.vehicle_name}
                                    className="max-h-full max-w-full object-contain object-center drop-shadow-lg"
                                />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-9xl">🚗</span>
                            </div>
                        )}

                        {images.length > 1 && (
                            <>
                                <div onClick={(e) => { e.stopPropagation(); setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                </div>
                                <div onClick={(e) => { e.stopPropagation(); setCurrentImageIdx((prev) => (prev + 1) % images.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </>
                        )}

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

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
                            </div>
                        </div>
                    </div>

                    <div className="p-5 md:p-6">
                        {images.length > 1 && (
                            <div className="flex justify-center gap-2 mb-5">
                                {images.map((_, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentImageIdx(idx)}
                                        className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${
                                            currentImageIdx === idx ? 'bg-blue-600 scale-125 shadow-sm' : 'bg-gray-300 hover:bg-gray-400'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 mb-5 border border-blue-100">
                            <div className="text-center md:text-left">
                                <p className="text-sm text-gray-500">{t("vehicleCategory.modal.dailyRentalPrice")}</p>
                                <p className="text-4xl font-bold text-blue-600">
                                    USD {vehicle.price_per_day}
                                    <span className="text-lg text-gray-500 font-normal">{t("vehicleCategory.card.perDay")}</span>
                                </p>
                            </div>
                        </div>

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

                        <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                            <button
                                onClick={onClose}
                                className="flex-1 px-6 py-2.5 font-medium rounded-xl transition-colors"
                                style={{ backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db' }}
                            >
                                {t("vehicleCategory.modal.close")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VehicleDetailsModal;