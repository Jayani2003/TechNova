import { useState, useMemo } from "react";
import Hero       from "./Hero";
import PackageFilters    from "./PackageFilters";
import PackageGrid       from "./PackageGrid";
import PackageDetailModal from "./PackageDetailModal";
import { filterPackages } from "./packagesData";

const Package = () => {
  const [activeType, setActiveType] = useState('All');
  const [activeDays, setActiveDays] = useState('All');
  const [selectedPkg, setSelectedPkg] = useState(null);

  // Re-filters automatically whenever data or filters change
  const filtered = useMemo(
    () => filterPackages(activeType, activeDays),
    [activeType, activeDays]
  );

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  const handleDaysChange = (days) => {
    setActiveDays(days);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fffe' }}>

      {/* Hero */}
      <Hero />

      {/* Sticky filter bar */}
      <PackageFilters
        activeType={activeType}
        activeDays={activeDays}
        onTypeChange={handleTypeChange}
        onDaysChange={handleDaysChange}
        total={filtered.length}
      />

      {/* Package grid */}
      <PackageGrid
        packages={filtered}
        onShowMore={setSelectedPkg}
      />

      {/* Detail modal */}
      {selectedPkg && (
        <PackageDetailModal
          pkg={selectedPkg}
          onClose={() => setSelectedPkg(null)}
        />
      )}

    </div>
  );
};

export default Package;
