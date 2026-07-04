import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyState = ({ categoryName }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="text-8xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {t("vehicleCategory.grid.noVehicles")}
            </h3>
            <p className="text-gray-500 text-center max-w-md">
                {categoryName
                    ? t("vehicleCategory.grid.noVehiclesCategory", { category: categoryName })
                    : t("vehicleCategory.grid.noVehiclesFilters")}
            </p>
        </div>
    );
};

export default EmptyState;