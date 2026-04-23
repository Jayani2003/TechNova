import { useEffect, useMemo, useState } from "react";
import Hero       from "./Hero";
import PackageFilters    from "./PackageFilters";
import PackageGrid       from "./PackageGrid";
import PackageDetailModal from "./PackageDetailModal";
import { filterPackages } from "./packagesData";

const Package = () => {
  const [activeType, setActiveType] = useState('All');
  const [activeDays, setActiveDays] = useState('All');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const handlePackagesChanged = () => {
      setDataVersion((version) => version + 1);
    };

    window.addEventListener('sl-admin-packages-changed', handlePackagesChanged);
    window.addEventListener('storage', handlePackagesChanged);

    return () => {
      window.removeEventListener('sl-admin-packages-changed', handlePackagesChanged);
      window.removeEventListener('storage', handlePackagesChanged);
    };
  }, []);

  // Re-filters automatically whenever data or filters change
  const filtered = useMemo(
    () => filterPackages(activeType, activeDays),
    [activeType, activeDays, dataVersion]
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
