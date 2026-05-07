import { useEffect, useMemo, useState } from "react";
import Hero       from "./Hero";
import PackageFilters    from "./PackageFilters";
import PackageGrid       from "./PackageGrid";
import PackageDetailModal from "./PackageDetailModal";
import { buildApiUrl } from '../../../../../config/api';

const Package = () => {
  const [activeType, setActiveType] = useState('All');
  const [activeDays, setActiveDays] = useState('All');
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const [packages, setPackages] = useState([]);

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

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(buildApiUrl('/packages'));
        if (res.ok) {
          const data = await res.json();
          setPackages(data);
        }
      } catch (e) {
        console.error('Failed to load packages', e);
      }
    })();
  }, [dataVersion]);

  // Re-filters automatically whenever data or filters change
  const filtered = useMemo(() => {
    return packages.filter(p =>
      (activeType === 'All' || p.type === activeType) &&
      (activeDays === 'All' || p.days === Number(activeDays))
    );
  }, [packages, activeType, activeDays, dataVersion]);

  const handleTypeChange = (type) => {
    setActiveType(type);
  };

  const handleDaysChange = (days) => {
    setActiveDays(days);
  };

  const handleShowMore = async (pkg) => {
    try {
      const res = await fetch(buildApiUrl(`/packages/${pkg.id}`));
      if (res.ok) {
        const data = await res.json();
        setSelectedPkg({
          ...data,
          highlights: data.highlights || [],
        });
        return;
      }
    } catch (error) {
      console.error('Failed to load package detail', error);
    }

    setSelectedPkg({
      ...pkg,
      highlights: pkg.highlights || [],
      destinations: pkg.destinations || [],
    });
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
        onShowMore={handleShowMore}
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
