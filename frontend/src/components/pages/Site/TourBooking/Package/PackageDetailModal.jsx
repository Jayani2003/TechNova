import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const TYPE_ICONS = {
  'Beach Side':          '🏖️',
  'Hill Country':        '🏔️',
  'Safari':              '🐘',
  'Cultural Heritage':   '🏛️',
  'Adventure':           '🧗',
  'Wellness & Ayurveda': '🌿',
};

const PackageDetailModal = ({ pkg, onClose }) => {
  if (!pkg) return null;

  return (
    <>
      <style>{`
        .pdm-backdrop {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(0,20,18,0.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
        }
        .pdm-modal {
          background: #fff;
          border-radius: 24px;
          max-width: 860px; width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 40px 80px rgba(0,60,50,0.3);
          position: relative;
        }

        /* Hero */
        .pdm-hero {
          position: relative; height: 280px; flex-shrink: 0;
          border-radius: 24px 24px 0 0; overflow: hidden;
        }
        .pdm-hero img { width: 100%; height: 100%; object-fit: cover; }
        .pdm-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(160deg, rgba(0,20,18,0.2) 0%, rgba(0,60,50,0.75) 100%);
        }
        .pdm-hero-content {
          position: absolute; bottom: 24px; left: 28px; right: 80px;
        }
        .pdm-type-badge {
          display: inline-block;
          padding: 4px 14px; border-radius: 100px;
          background: #00b0a5; color: #fff;
          font-size: 9px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          margin-bottom: 10px;
        }
        .pdm-title {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 800; color: #fff;
          line-height: 1.1; letter-spacing: -0.03em;
        }
        .pdm-days-badge {
          display: inline-flex; align-items: center; gap: 6px;
          margin-top: 10px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px; padding: 5px 14px;
          color: #fff; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        /* Close btn */
        .pdm-close {
          position: absolute; top: 16px; right: 16px; z-index: 10;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff; font-size: 18px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.2s;
        }
        .pdm-close:hover { background: rgba(255,255,255,0.3); }

        /* Body */
        .pdm-body { padding: 28px 28px 32px; }

        .pdm-desc {
          font-size: 15px; font-weight: 300; color: #3a5a5a;
          line-height: 1.8; margin-bottom: 20px;
        }

        /* Highlights */
        .pdm-highlights {
          display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;
        }
        .pdm-hl {
          padding: 5px 14px; border-radius: 100px;
          background: rgba(0,176,165,0.08);
          border: 1px solid rgba(0,176,165,0.25);
          font-size: 11px; font-weight: 600; color: #00b0a5;
          letter-spacing: 0.06em;
        }

        /* Section heading */
        .pdm-section-heading {
          font-size: 10px; font-weight: 800;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #3a5a5a; margin-bottom: 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .pdm-section-heading::after {
          content: ''; flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(0,176,165,0.3), transparent);
        }

        /* Destination cards */
        .pdm-dest-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 16px; margin-bottom: 32px;
        }
        .pdm-dest-card {
          border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(0,176,165,0.12);
          box-shadow: 0 4px 16px rgba(0,60,50,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .pdm-dest-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,60,50,0.12);
        }
        .pdm-dest-img {
          position: relative; height: 140px; overflow: hidden;
        }
        .pdm-dest-img img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s ease;
        }
        .pdm-dest-card:hover .pdm-dest-img img { transform: scale(1.06); }
        .pdm-dest-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, transparent 50%, rgba(0,30,25,0.5) 100%);
        }
        .pdm-dest-days {
          position: absolute; bottom: 10px; right: 10px;
          background: rgba(0,176,165,0.9); backdrop-filter: blur(6px);
          color: #fff; font-size: 9px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 4px 10px; border-radius: 100px;
        }
        .pdm-dest-info { padding: 14px; background: #fff; }
        .pdm-dest-name {
          font-size: 14px; font-weight: 800;
          color: #0d2b2b; letter-spacing: -0.02em; margin-bottom: 5px;
        }
        .pdm-dest-desc {
          font-size: 12px; font-weight: 300;
          color: #5a8080; line-height: 1.6;
        }

        /* CTA */
        .pdm-cta {
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
          padding-top: 8px; border-top: 1px solid rgba(0,176,165,0.1);
        }
        .pdm-book-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #00b0a5; color: #fff;
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px 28px; border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 6px 24px -4px rgba(0,176,165,0.45);
          transition: all 0.25s ease;
        }
        .pdm-book-btn:hover { background: #009e94; transform: translateY(-2px); }
        .pdm-close-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #5a8080;
          font-size: 13px; font-weight: 600; letter-spacing: 0.06em;
          padding: 14px 20px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.2);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pdm-close-btn:hover { border-color: #00b0a5; color: #00b0a5; }
      `}</style>

      <AnimatePresence>
        <motion.div
          className="pdm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="pdm-modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
            onClick={e => e.stopPropagation()}
          >
            {/* Hero */}
            <div className="pdm-hero">
              <img src={pkg.image} alt={pkg.title} />
              <div className="pdm-hero-overlay" />
              <button className="pdm-close" onClick={onClose}>✕</button>
              <div className="pdm-hero-content">
                <div className="pdm-type-badge">
                  {TYPE_ICONS[pkg.type]} {pkg.type}
                </div>
                <div className="pdm-title">{pkg.title}</div>
                <div className="pdm-days-badge">
                  📅 {pkg.days} Days · {pkg.destinations.length} Destinations
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="pdm-body">
              <p className="pdm-desc">{pkg.description}</p>

              {/* Highlights */}
              <div className="pdm-highlights">
                {pkg.highlights.map(h => (
                  <span key={h} className="pdm-hl">✦ {h}</span>
                ))}
              </div>

              {/* Destinations */}
              <div className="pdm-section-heading">Destinations & Itinerary</div>
              <div className="pdm-dest-grid">
                {pkg.destinations.map((dest, i) => (
                  <div key={i} className="pdm-dest-card">
                    <div className="pdm-dest-img">
                      <img src={dest.image} alt={dest.name} />
                      <div className="pdm-dest-img-overlay" />
                      <span className="pdm-dest-days">{dest.days} {dest.days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="pdm-dest-info">
                      <div className="pdm-dest-name">
                        <span style={{color:'#00b0a5', marginRight:'6px'}}>{i + 1}.</span>
                        {dest.name}
                      </div>
                      <div className="pdm-dest-desc">{dest.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="pdm-cta">
                <Link
                  to={`/tour-booking/package?id=${pkg.id}`}
                  className="pdm-book-btn"
                >
                  <span>Book This Package</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <button className="pdm-close-btn" onClick={onClose}>
                  ← Back to packages
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default PackageDetailModal;
