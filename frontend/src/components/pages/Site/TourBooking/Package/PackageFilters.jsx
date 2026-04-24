import { getTypes, getDays } from './packagesData';

// Type icons map — add a new entry when a new type is added to packagesData
const TYPE_ICONS = {
  'Beach Side':          '🏖️',
  'Hill Country':        '🏔️',
  'Safari':              '🐘',
  'Cultural Heritage':   '🏛️',
  'Adventure':           '🧗',
  'Wellness & Ayurveda': '🌿',
};

const PackageFilters = ({ activeType, activeDays, onTypeChange, onDaysChange, total }) => {
  const types = ['All', ...getTypes()];
  const days  = ['All', ...getDays()];

  return (
    <>
      <style>{`
        .pf-wrap {
          background: #fff;
          border-bottom: 1px solid rgba(0,176,165,0.12);
          position: sticky; top: 0; z-index: 40;
          box-shadow: 0 4px 24px rgba(0,176,165,0.06);
        }
        .pf-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 20px 32px;
          display: flex; flex-direction: column; gap: 16px;
        }
        @media(max-width:768px){ .pf-inner { padding: 16px; } }

        /* Row */
        .pf-row {
          display: flex; align-items: center; gap: 10px;
          flex-wrap: wrap;
        }
        .pf-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #3a5a5a; flex-shrink: 0; margin-right: 4px;
        }

        /* Type pills */
        .pf-type-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 7px 16px; border-radius: 100px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: transparent; color: #3a5a5a;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .pf-type-btn:hover {
          border-color: #00b0a5; color: #00b0a5;
          background: rgba(0,176,165,0.06);
        }
        .pf-type-btn.active {
          background: #00b0a5; color: #fff;
          border-color: #00b0a5;
          box-shadow: 0 4px 14px rgba(0,176,165,0.35);
        }

        /* Day pills */
        .pf-day-btn {
          display: inline-flex; align-items: center;
          padding: 6px 18px; border-radius: 100px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
          border: 1.5px solid rgba(0,176,165,0.25);
          background: transparent; color: #3a5a5a;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        .pf-day-btn:hover {
          border-color: #00b0a5; color: #00b0a5;
          background: rgba(0,176,165,0.06);
        }
        .pf-day-btn.active {
          background: linear-gradient(135deg, #00b0a5, #009e94);
          color: #fff; border-color: transparent;
          box-shadow: 0 4px 14px rgba(0,176,165,0.35);
        }

        /* Result count */
        .pf-count {
          margin-left: auto; font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #00b0a5;
          flex-shrink: 0;
        }
        .pf-count span { color: #0d2b2b; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }
      `}</style>

      <div className="pf-wrap">
        <div className="pf-inner">

          {/* Type row */}
          <div className="pf-row">
            <span className="pf-label">Type</span>
            {types.map(t => (
              <button
                key={t}
                className={`pf-type-btn ${activeType === t ? 'active' : ''}`}
                onClick={() => onTypeChange(t)}
              >
                {TYPE_ICONS[t] && <span>{TYPE_ICONS[t]}</span>}
                {t}
              </button>
            ))}
          </div>

          {/* Days row + count */}
          <div className="pf-row">
            <span className="pf-label">Duration</span>
            {days.map(d => (
              <button
                key={d}
                className={`pf-day-btn ${activeDays === String(d) ? 'active' : ''}`}
                onClick={() => onDaysChange(String(d))}
              >
                {d === 'All' ? 'All Durations' : `${d} Days`}
              </button>
            ))}
            <span className="pf-count">
              <span>{total}</span> packages
            </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default PackageFilters;
