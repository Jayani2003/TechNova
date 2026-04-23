import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const TYPE_COLORS = {
  'Beach Side':          '#0099cc',
  'Hill Country':        '#5c8a3c',
  'Safari':              '#cc7722',
  'Cultural Heritage':   '#8855cc',
  'Adventure':           '#cc3344',
  'Wellness & Ayurveda': '#33997a',
};

const TYPE_ICONS = {
  'Beach Side':          '🏖️',
  'Hill Country':        '🏔️',
  'Safari':              '🐘',
  'Cultural Heritage':   '🏛️',
  'Adventure':           '🧗',
  'Wellness & Ayurveda': '🌿',
};

const PackageCard = ({ pkg, onShowMore, index = 0 }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add('pkc-visible'); },
      { threshold: 0.1 }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);

  const accentColor = TYPE_COLORS[pkg.type] || '#00b0a5';
  const topDests = pkg.destinations.slice(0, 3);

  return (
    <>
      <style>{`
        .pkc-card {
          background: #fff;
          border: 1px solid rgba(0,176,165,0.12);
          border-radius: 20px;
          overflow: hidden;
          opacity: 0; transform: translateY(32px);
          transition:
            opacity 0.7s cubic-bezier(0.22,1,0.36,1),
            transform 0.7s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.3s ease;
          box-shadow: 0 4px 24px rgba(0,60,50,0.06);
        }
        .pkc-card.pkc-visible { opacity: 1; transform: translateY(0); }
        .pkc-card:hover {
          box-shadow: 0 16px 48px rgba(0,60,50,0.14);
          transform: translateY(-4px);
        }

        /* Image */
        .pkc-img-wrap {
          position: relative; height: 220px; overflow: hidden;
        }
        .pkc-img {
          width: 100%; height: 100%; object-fit: cover;
          transform: scale(1.04);
          transition: transform 1s cubic-bezier(0.22,1,0.36,1);
        }
        .pkc-card:hover .pkc-img { transform: scale(1.10); }
        .pkc-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            160deg,
            rgba(0,20,18,0.15) 0%,
            rgba(0,20,18,0.05) 40%,
            rgba(0,40,36,0.60) 100%
          );
        }
        .pkc-shimmer {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%, rgba(0,176,165,0.6) 30%,
            rgba(0,220,205,0.9) 50%, rgba(0,176,165,0.6) 70%, transparent 100%
          );
          animation: pkc-sh 3s ease-in-out infinite;
        }
        @keyframes pkc-sh {
          0%,100%{ opacity:0.5; transform:scaleX(0.8); }
          50%    { opacity:1;   transform:scaleX(1); }
        }

        /* Type badge */
        .pkc-type-badge {
          position: absolute; top: 14px; left: 14px; z-index: 2;
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 100px;
          background: rgba(0,0,0,0.45); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 9px; font-weight: 800;
          letter-spacing: 0.18em; text-transform: uppercase;
        }
        .pkc-type-dot {
          width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
        }

        /* Days badge */
        .pkc-days-badge {
          position: absolute; top: 14px; right: 14px; z-index: 2;
          background: rgba(0,176,165,0.92); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          color: #fff; font-size: 9px; font-weight: 800;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px;
          box-shadow: 0 4px 12px rgba(0,176,165,0.35);
        }

        /* Destination mini-chips on image bottom */
        .pkc-dest-chips {
          position: absolute; bottom: 14px; left: 12px; right: 12px;
          display: flex; gap: 6px; flex-wrap: nowrap; overflow: hidden; z-index: 2;
        }
        .pkc-dest-chip {
          background: rgba(255,255,255,0.12); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 10px; font-weight: 600;
          padding: 4px 10px; border-radius: 100px; white-space: nowrap;
        }
        .pkc-dest-more {
          background: rgba(0,176,165,0.7); backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff; font-size: 10px; font-weight: 700;
          padding: 4px 10px; border-radius: 100px; white-space: nowrap;
        }

        /* Content */
        .pkc-content { padding: 20px 22px 22px; }

        .pkc-title {
          font-size: 1.25rem; font-weight: 800;
          color: #0d2b2b; letter-spacing: -0.03em;
          line-height: 1.2; margin-bottom: 8px;
        }

        .pkc-desc {
          font-size: 13.5px; font-weight: 300;
          color: #4a7070; line-height: 1.7;
          margin-bottom: 16px;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }

        /* Highlights */
        .pkc-highlights {
          display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 18px;
        }
        .pkc-hl {
          padding: 4px 10px; border-radius: 100px;
          background: rgba(0,176,165,0.07);
          border: 1px solid rgba(0,176,165,0.18);
          font-size: 10px; font-weight: 600; color: #00b0a5;
          letter-spacing: 0.04em;
        }

        /* Rule */
        .pkc-rule {
          height: 1px; margin-bottom: 18px;
          background: linear-gradient(90deg, rgba(0,176,165,0.2), transparent);
        }

        /* Actions */
        .pkc-actions { display: flex; gap: 10px; }
        .pkc-book-btn {
          flex: 1;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #00b0a5; color: #fff;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 12px 16px; border-radius: 10px;
          text-decoration: none;
          box-shadow: 0 4px 16px -4px rgba(0,176,165,0.45);
          transition: all 0.25s ease;
        }
        .pkc-book-btn:hover { background: #009e94; transform: translateY(-1px); }
        .pkc-more-btn {
          display: inline-flex; align-items: center; justify-content: center; gap-6px;
          padding: 12px 16px; border-radius: 10px;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: transparent; color: #3a5a5a;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pkc-more-btn:hover { border-color: #00b0a5; color: #00b0a5; background: rgba(0,176,165,0.05); }
      `}</style>

      <div
        ref={cardRef}
        className="pkc-card"
        style={{ transitionDelay: `${(index % 4) * 80}ms` }}
      >
        {/* Image */}
        <div className="pkc-img-wrap">
          <img className="pkc-img" src={pkg.image} alt={pkg.title} />
          <div className="pkc-overlay" />
          <div className="pkc-shimmer" />

          <div className="pkc-type-badge">
            <span className="pkc-type-dot" style={{ background: accentColor }} />
            {TYPE_ICONS[pkg.type]} {pkg.type}
          </div>
          <div className="pkc-days-badge">📅 {pkg.days} Days</div>

          <div className="pkc-dest-chips">
            {topDests.map(d => (
              <span key={d.name} className="pkc-dest-chip">{d.name}</span>
            ))}
            {pkg.destinations.length > 3 && (
              <span className="pkc-dest-more">+{pkg.destinations.length - 3} more</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="pkc-content">
          <div className="pkc-title">{pkg.title}</div>
          <div className="pkc-desc">{pkg.description}</div>

          <div className="pkc-highlights">
            {pkg.highlights.slice(0, 3).map(h => (
              <span key={h} className="pkc-hl">✦ {h}</span>
            ))}
          </div>

          <div className="pkc-rule" />

          <div className="pkc-actions">
            <Link to={`/tour-booking/package?id=${pkg.id}`} className="pkc-book-btn">
              Book Now
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <button className="pkc-more-btn" onClick={() => onShowMore(pkg)}>
              Details
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageCard;
