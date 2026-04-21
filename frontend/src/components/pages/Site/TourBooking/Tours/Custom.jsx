import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Custom = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) card.classList.add('cst-visible'); },
      { threshold: 0.15 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cst-card {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
          position: relative;
        }
        .cst-card.cst-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .cst-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 56px;
          align-items: center;
        }
        .cst-content { display: flex; flex-direction: column; gap: 24px; }

        /* Image side */
        .cst-img-wrap {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px -12px rgba(0,31,41,0.28);
        }
        .cst-img-wrap img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .cst-img-wrap:hover img { transform: scale(1.05); }
        .cst-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,95,115,0.15) 0%, rgba(148,210,189,0.08) 100%);
          pointer-events: none;
        }
        /* Floating card on image */
        .cst-float-card {
          position: absolute;
          bottom: 24px;
          left: 24px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 16px 20px;
          box-shadow: 0 8px 32px rgba(0,18,25,0.18);
          border: 1px solid rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .cst-float-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #005f73, #0a9396);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }
        .cst-float-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: #001219;
          line-height: 1;
        }
        .cst-float-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #6b8a95;
          margin-top: 3px;
        }
        /* Top-right badge */
        .cst-badge {
          position: absolute;
          top: 24px;
          right: 24px;
          background: linear-gradient(135deg, #005f73, #0a9396);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 100px;
        }

        /* Typography */
        .cst-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #0a9396;
        }
        .cst-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          font-weight: 700;
          color: #001219;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .cst-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #0a9396, rgba(10,147,150,0));
          border-radius: 2px;
        }
        .cst-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px;
          font-weight: 300;
          color: #4a6471;
          line-height: 1.8;
        }

        /* Steps row */
        .cst-steps {
          display: flex;
          gap: 0;
        }
        .cst-step {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
          position: relative;
        }
        .cst-step:not(:last-child)::after {
          content: '';
          position: absolute;
          top: 18px;
          left: calc(50% + 18px);
          right: calc(-50% + 18px);
          height: 1px;
          background: linear-gradient(90deg, #0a9396, #94d2bd);
        }
        .cst-step-num {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #005f73, #0a9396);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0,95,115,0.3);
        }
        .cst-step-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          color: #6b8a95;
          letter-spacing: 0.3px;
        }

        /* Button */
        .cst-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #001219 0%, #005f73 100%);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 16px 32px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 32px -4px rgba(0,18,25,0.45);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          overflow: hidden;
        }
        .cst-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #005f73 0%, #0a9396 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .cst-btn:hover::before { opacity: 1; }
        .cst-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px -4px rgba(0,18,25,0.5);
        }
        .cst-btn span { position: relative; z-index: 1; }
        .cst-btn-arrow {
          position: relative; z-index: 1;
          transition: transform 0.3s ease;
        }
        .cst-btn:hover .cst-btn-arrow { transform: translateX(4px); }
      `}</style>

      <div ref={cardRef} className="cst-card">
        <div className="cst-grid">
          {/* Content - left on desktop */}
          <div className="cst-content" style={{ order: 1 }}>
            <div className="cst-eyebrow">Bespoke Experience</div>
            <h2 className="cst-title">Customized<br />Tours</h2>
            <div className="cst-divider" />
            <p className="cst-desc">
              Your journey, your rules. Select your favourite stops, your preferred vehicle,
              and let us handle the logistics. Freedom is the ultimate luxury.
            </p>

            {/* How it works steps */}
            <div className="cst-steps">
              {['Choose Stops', 'Pick Vehicle', 'We Handle It'].map((s, i) => (
                <div key={s} className="cst-step">
                  <div className="cst-step-num">{i + 1}</div>
                  <div className="cst-step-label">{s}</div>
                </div>
              ))}
            </div>

            <div>
              <Link to="/tour-booking/customized" style={{ textDecoration: 'none' }}>
                <button className="cst-btn">
                  <span>Design Your Tour</span>
                  <svg className="cst-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </div>
          </div>

          {/* Image - right on desktop */}
          <div className="cst-img-wrap" style={{ order: 2 }}>
            <img
              src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=800"
              alt="Sri Lankan Hill Country"
            />
            <div className="cst-img-overlay" />
            <div className="cst-badge">Fully Custom</div>
            <div className="cst-float-card">
              <div className="cst-float-icon">🗺️</div>
              <div>
                <div className="cst-float-label">Your itinerary, your pace</div>
                <div className="cst-float-sub">Crafted just for you</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom;
