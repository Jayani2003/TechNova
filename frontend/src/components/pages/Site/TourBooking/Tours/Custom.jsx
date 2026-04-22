import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Custom = () => {
  const cardRef = useRef(null);
  useEffect(() => {
    const c = cardRef.current; if (!c) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) c.classList.add('cst-visible'); },
      { threshold: 0.12 }
    );
    obs.observe(c); return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ── Premium image system ── */
        .cst-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow:
            0 32px 64px -16px rgba(0,60,50,0.30),
            0 0 0 1px rgba(0,176,165,0.18),
            inset 0 0 0 1px rgba(255,255,255,0.06);
        }
        .cst-img {
          width: 100%; height: 100%;
          object-fit: cover; display: block;
          transform: scale(1.04);
          transition: transform 1.1s cubic-bezier(0.22,1,0.36,1);
        }
        .cst-img-wrap:hover .cst-img { transform: scale(1.10); }
        .cst-overlay {
          position: absolute; inset: 0; pointer-events: none;
          background: linear-gradient(
            160deg,
            rgba(0,20,18,0.18) 0%,
            rgba(0,20,18,0.08) 35%,
            rgba(0,40,36,0.55) 70%,
            rgba(0,80,72,0.72) 100%
          );
        }
        .cst-shimmer {
          position: absolute; bottom: 0; left: 0; right: 0;
          height: 2px; pointer-events: none;
          background: linear-gradient(90deg,
            transparent 0%, rgba(0,176,165,0.6) 30%,
            rgba(0,220,205,0.9) 50%, rgba(0,176,165,0.6) 70%, transparent 100%
          );
          animation: cst-shimmer-anim 3s ease-in-out infinite;
        }
        @keyframes cst-shimmer-anim {
          0%,100% { opacity: 0.5; transform: scaleX(0.8); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }
        .cst-badge {
          position: absolute; top: 16px; right: 16px; z-index: 3;
          background: rgba(0,176,165,0.92); backdrop-filter: blur(10px);
          color: #fff; font-size: 9px; font-weight: 800;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 100px;
          border: 1px solid rgba(255,255,255,0.25);
          box-shadow: 0 4px 16px rgba(0,176,165,0.4);
        }
        .cst-float {
          position: absolute; bottom: 16px; left: 16px; z-index: 3;
          background: rgba(255,255,255,0.10); backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.22); border-radius: 14px;
          padding: 11px 14px; display: flex; align-items: center; gap: 11px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .cst-float-icon {
          width: 34px; height: 34px;
          background: rgba(0,176,165,0.25); border: 1px solid rgba(0,176,165,0.4);
          border-radius: 9px; display: flex; align-items: center;
          justify-content: center; font-size: 15px; flex-shrink: 0;
        }
        .cst-float-title { font-size: 12px; font-weight: 700; color: #fff; line-height: 1; }
        .cst-float-sub   { font-size: 10px; font-weight: 300; color: rgba(255,255,255,0.65); margin-top: 3px; }

        .cst-stats {
  position: absolute; bottom: 14px; left: 14px; right: 14px;
  display: flex; gap: 8px; z-index: 3;
}
.cst-stat {
  flex: 1;
  background: rgba(255,255,255,0.08); backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px; padding: 9px 6px; text-align: center;
}
.cst-stat-num {
  display: block; font-size: 17px; font-weight: 800;
  letter-spacing: -0.03em; color: #ffffff; line-height: 1;
  text-shadow: 0 0 12px rgba(0,220,200,0.6);
}
.cst-stat-label {
  display: block; font-size: 8px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255,255,255,0.65); margin-top: 3px;
}

        /* ── Card ── */
        .cst-card {
          background: #ffffff;
          border: 1px solid rgba(0,176,165,0.14);
          border-radius: 24px; padding: 48px;
          box-shadow: 0 4px 32px rgba(0,176,165,0.07), 0 1px 4px rgba(0,0,0,0.04);
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.85s cubic-bezier(0.22,1,0.36,1),
                      transform 0.85s cubic-bezier(0.22,1,0.36,1),
                      box-shadow 0.3s ease;
        }
        .cst-card.cst-visible { opacity: 1; transform: translateY(0); }
        .cst-card:hover {
          box-shadow: 0 16px 56px rgba(0,176,165,0.13), 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-3px);
        }
        @media(max-width:768px){ .cst-card { padding: 28px 20px; } }
        .cst-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 52px; align-items: center;
        }
        .cst-content { display: flex; flex-direction: column; gap: 20px; }
        .cst-eyebrow {
          display: inline-block; padding: 5px 16px;
          background: rgba(0,176,165,0.10); border: 1px solid rgba(0,176,165,0.35);
          border-radius: 100px; font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #00b0a5; width: fit-content;
        }
        .cst-title {
          font-size: clamp(2.4rem, 4.5vw, 3.2rem);
          font-weight: 800; color: #0d2b2b;
          line-height: 1.05; letter-spacing: -0.03em;
        }
        .cst-title .teal { color: #00b0a5; }
        .cst-rule {
          width: 44px; height: 2px;
          background: linear-gradient(90deg, #00b0a5, rgba(0,176,165,0));
          border-radius: 2px;
        }
        .cst-desc { font-size: 16px; font-weight: 300; color: #3a5a5a; line-height: 1.82; max-width: 440px; }
        .cst-steps { display: flex; align-items: flex-start; }
        .cst-step {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; gap: 8px;
          text-align: center; position: relative;
        }
        .cst-step-num {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #00b0a5, #009e94);
          color: #fff; font-size: 15px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(0,176,165,0.35);
          position: relative; z-index: 1; letter-spacing: -0.02em;
        }
        .cst-step-label { font-size: 11px; font-weight: 400; color: #5a7a7a; letter-spacing: 0.15em; text-transform: uppercase; }
        .cst-step-line {
          position: absolute; top: 18px;
          left: calc(50% + 18px); right: calc(-50% + 18px);
          height: 1px; background: linear-gradient(90deg, #00b0a5, rgba(0,176,165,0.2));
        }
        .cst-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: #00b0a5; color: #fff; font-size: 13px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          padding: 14px 28px; border-radius: 10px; border: none;
          cursor: pointer; text-decoration: none; width: fit-content;
          box-shadow: 0 6px 24px -4px rgba(0,176,165,0.45);
          transition: all 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .cst-btn:hover { background: #009e94; transform: translateY(-2px); box-shadow: 0 14px 36px -4px rgba(0,176,165,0.5); }
        .cst-arrow { transition: transform 0.25s ease; }
        .cst-btn:hover .cst-arrow { transform: translateX(4px); }
      `}</style>

      <div ref={cardRef} className="cst-card">
        <div className="cst-grid">

          {/* Content — left */}
          <div className="cst-content" style={{ order: 1 }}>
            <span className="cst-eyebrow">Bespoke Experience</span>
            <h2 className="cst-title">Customized <span className="teal">Tours.</span></h2>
            <div className="cst-rule" />
            <p className="cst-desc">
              Your journey, your rules. Select your favourite stops, your preferred
              vehicle category, and let us handle the logistics. Freedom is the ultimate luxury.
            </p>
            <div className="cst-steps">
              {['Your Plans', 'Pick Vehicle', 'We Handle It'].map((s, i, arr) => (
                <div key={s} className="cst-step">
                  {i < arr.length - 1 && <div className="cst-step-line" />}
                  <div className="cst-step-num">{i + 1}</div>
                  <div className="cst-step-label">{s}</div>
                </div>
              ))}
            </div>
            <Link to="/tour-booking/customized" className="cst-btn">
              <span>Design Your Tour</span>
              <svg className="cst-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Image — right */}
          {/* <div className="cst-img-wrap" style={{ order: 2 }}>
            <span className="cst-badge">Fully Custom</span>
            <img className="cst-img"
              src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=900"
              alt="Customized Tours"
            />
            <div className="cst-overlay" />
            <div className="cst-shimmer" />
            <div className="cst-float">
              <div className="cst-float-icon">🗺️</div>
              <div>
                <div className="cst-float-title">Your itinerary, your pace</div>
                <div className="cst-float-sub">Crafted just for you</div>
              </div>
            </div>
          </div> */}
          <div className="cst-img-wrap" style={{ order: 2 }}>
  <span className="cst-badge">Fully Custom</span>
  <img className="cst-img"
    src="https://images.unsplash.com/photo-1650867715136-0774db12a0fb?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    alt="Customized Tours"
  />
  <div className="cst-overlay" />
  <div className="cst-shimmer" />
  <div className="cst-stats">
    {[['500+','Happy Customers'],['10+','Years Exp'],['100%','Bespoke']].map(([n, l]) => (
      <div key={l} className="cst-stat">
        <span className="cst-stat-num">{n}</span>
        <span className="cst-stat-label">{l}</span>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Custom;
