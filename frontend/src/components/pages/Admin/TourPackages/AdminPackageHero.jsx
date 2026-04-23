const AdminPackageHero = ({ total, onAddNew }) => (
  <>
    <style>{`
      .aph-wrap {
        background: linear-gradient(135deg, #5b6434 0%, #718019 50%, #062e28 100%);
        padding: 36px 40px 32px;
        position: relative; overflow: hidden;
      }
      @media(max-width:768px){ .aph-wrap { padding: 24px 20px 20px; } }

      /* Decorative orbs */
      .aph-orb-1 {
        position: absolute; width: 320px; height: 320px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,176,165,0.12) 0%, transparent 70%);
        top: -100px; right: -60px; pointer-events: none;
      }
      .aph-orb-2 {
        position: absolute; width: 180px; height: 180px; border-radius: 50%;
        background: radial-gradient(circle, rgba(0,220,200,0.07) 0%, transparent 70%);
        bottom: -60px; left: 30%; pointer-events: none;
      }
      /* Shimmer line */
      .aph-shimmer {
        position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
        background: linear-gradient(90deg, transparent 0%, rgba(0,176,165,0.5) 30%, rgba(0,220,205,0.9) 50%, rgba(0,176,165,0.5) 70%, transparent 100%);
        animation: aph-sh 3s ease-in-out infinite;
      }
      @keyframes aph-sh {
        0%,100%{ opacity:0.4; transform:scaleX(0.8); }
        50%    { opacity:1;   transform:scaleX(1); }
      }

      .aph-inner {
        max-width: 1280px; margin: 0 auto;
        display: flex; align-items: center; justify-content: space-between;
        gap: 24px; flex-wrap: wrap; position: relative; z-index: 1;
      }

      .aph-left { display: flex; flex-direction: column; gap: 6px; }
      .aph-eyebrow {
        font-size: 9px; font-weight: 800;
        letter-spacing: 0.25em; text-transform: uppercase;
        color: #00b0a5;
      }
      .aph-title {
        font-size: clamp(1.6rem, 3vw, 2.2rem);
        font-weight: 800; color: #fff;
        letter-spacing: -0.03em; line-height: 1.1;
      }
      .aph-title span { color: #00ddd0; }
      .aph-sub {
        font-size: 13px; font-weight: 300;
        color: rgba(255,255,255,0.55); margin-top: 2px;
      }

      /* Stats pills */
      .aph-stats {
        display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px;
      }
      .aph-stat {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 6px 14px; border-radius: 100px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
      }
      .aph-stat-n {
        font-size: 16px; font-weight: 800;
        color: #00ddd0; letter-spacing: -0.03em;
      }
      .aph-stat-l {
        font-size: 9px; font-weight: 700;
        letter-spacing: 0.16em; text-transform: uppercase;
        color: rgba(255,255,255,0.5);
      }

      /* Add button */
      .aph-add-btn {
        display: inline-flex; align-items: center; gap: 10px;
        background: #00b0a5; color: #fff;
        font-size: 12px; font-weight: 700;
        letter-spacing: 0.1em; text-transform: uppercase;
        padding: 14px 26px; border-radius: 12px; border: none;
        cursor: pointer;
        box-shadow: 0 8px 28px rgba(0,176,165,0.4);
        transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
        flex-shrink: 0;
      }
      .aph-add-btn:hover {
        background: #009e94; transform: translateY(-2px);
        box-shadow: 0 14px 36px rgba(0,176,165,0.5);
      }
      .aph-add-btn svg { transition: transform 0.2s ease; }
      .aph-add-btn:hover svg { transform: rotate(90deg); }
    `}</style>

    <div className="aph-wrap">
      <div className="aph-orb-1" />
      <div className="aph-orb-2" />
      <div className="aph-shimmer" />

      <div className="aph-inner">
        <div className="aph-left">
          <span className="aph-eyebrow">Admin Dashboard</span>
          <h1 className="aph-title">Package <span>Management.</span></h1>
          <p className="aph-sub">Create, edit and delete tour packages. Changes reflect instantly on the user site.</p>
          <div className="aph-stats">
            {[
              { n: total,  l: 'Total Packages' },
              { n: '6',    l: 'Types' },
              { n: '4',    l: 'Durations' },
            ].map(({ n, l }) => (
              <div key={l} className="aph-stat">
                <span className="aph-stat-n">{n}</span>
                <span className="aph-stat-l">{l}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="aph-add-btn" onClick={onAddNew}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add New Package
        </button>
      </div>
    </div>
  </>
);

export default AdminPackageHero;