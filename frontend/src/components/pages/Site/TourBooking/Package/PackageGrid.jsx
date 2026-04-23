import { motion, AnimatePresence } from "framer-motion";
import PackageCard from "./PackageCard";

const PackageGrid = ({ packages, onShowMore }) => {
  if (packages.length === 0) {
    return (
      <div style={{
        textAlign: 'center', padding: '80px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px'
      }}>
        <div style={{ fontSize: '48px' }}>🔍</div>
        <h3 style={{
          fontSize: '1.4rem', fontWeight: 800,
          color: '#0d2b2b', letterSpacing: '-0.02em'
        }}>
          No packages found
        </h3>
        <p style={{ fontSize: '15px', fontWeight: 300, color: '#5a8080', maxWidth: '320px' }}>
          Try adjusting your filters to discover more Sri Lanka experiences.
        </p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .pkg-grid-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 48px 32px 80px;
        }
        @media(max-width:768px){ .pkg-grid-wrap { padding: 32px 16px 60px; } }

        .pkg-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
        }
      `}</style>

      <div className="pkg-grid-wrap">
        <AnimatePresence mode="popLayout">
          <div className="pkg-grid">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22,1,0.36,1] }}
              >
                <PackageCard pkg={pkg} onShowMore={onShowMore} index={i} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </>
  );
};

export default PackageGrid;
