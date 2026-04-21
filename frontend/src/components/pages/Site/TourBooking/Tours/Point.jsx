import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Point = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) card.classList.add('ptp-visible'); },
      { threshold: 0.15 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .ptp-section {
          background: linear-gradient(135deg, #001219 0%, #005f73 100%);
          border-radius: 32px;
          padding: 64px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        @media (max-width: 768px) {
          .ptp-section { padding: 36px 24px; }
        }
        .ptp-section.ptp-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .ptp-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          opacity: 0.4;
        }
        .ptp-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .ptp-orb-1 {
          width: 360px; height: 360px;
          background: radial-gradient(circle, rgba(10,147,150,0.18) 0%, transparent 70%);
          top: -80px; right: -80px;
        }
        .ptp-orb-2 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, rgba(148,210,189,0.12) 0%, transparent 70%);
          bottom: -40px; left: 40%;
        }
        .ptp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 56px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        .ptp-img-wrap {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 40px 80px -16px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .ptp-img-wrap img {
          width: 100%;
          height: 360px;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .ptp-img-wrap:hover img { transform: scale(1.05); }
        .ptp-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0,18,25,0.6) 100%);
        }
        .ptp-stat-row {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          gap: 12px;
        }
        .ptp-stat {
          flex: 1;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px;
          padding: 12px 14px;
          text-align: center;
        }
        .ptp-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 700;
          color: #94d2bd;
          display: block;
          line-height: 1;
        }
        .ptp-stat-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          display: block;
          margin-top: 4px;
        }
        .ptp-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #94d2bd;
        }
        .ptp-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          font-weight: 700;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .ptp-divider {
          width: 48px;
          height: 1px;
          background: linear-gradient(90deg, #94d2bd, rgba(148,210,189,0));
        }
        .ptp-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px;
          font-weight: 300;
          color: rgba(255,255,255,0.62);
          line-height: 1.8;
        }
        .ptp-features {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .ptp-feature {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: rgba(255,255,255,0.6);
        }
        .ptp-feature-icon {
          width: 28px;
          height: 28px;
          background: rgba(148,210,189,0.12);
          border: 1px solid rgba(148,210,189,0.25);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ptp-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.95);
          color: #001219;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.3px;
          padding: 16px 32px;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          box-shadow: 0 8px 32px -4px rgba(0,0,0,0.4);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .ptp-btn:hover {
          background: #94d2bd;
          color: #001219;
          transform: translateY(-2px);
          box-shadow: 0 16px 48px -4px rgba(0,0,0,0.5);
        }
        .ptp-btn-arrow { transition: transform 0.3s ease; }
        .ptp-btn:hover .ptp-btn-arrow { transform: translateX(4px); }
      `}</style>

      <div ref={cardRef} className="ptp-section">
        <div className="ptp-noise" />
        <div className="ptp-orb ptp-orb-1" />
        <div className="ptp-orb ptp-orb-2" />

        <div className="ptp-grid">
          {/* Image */}
          <div className="ptp-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
              alt="Point to Point"
            />
            <div className="ptp-img-overlay" />
            <div className="ptp-stat-row">
              <div className="ptp-stat">
                <span className="ptp-stat-num">24/7</span>
                <span className="ptp-stat-label">Available</span>
              </div>
              <div className="ptp-stat">
                <span className="ptp-stat-num">50+</span>
                <span className="ptp-stat-label">Destinations</span>
              </div>
              <div className="ptp-stat">
                <span className="ptp-stat-num">4.9★</span>
                <span className="ptp-stat-label">Rated</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="ptp-eyebrow">Seamless Transfers</div>
            <h2 className="ptp-title">Point to<br />Point</h2>
            <div className="ptp-divider" />
            <p className="ptp-desc">
              Reliable transfers between any two locations in Sri Lanka. Professional drivers
              and air-conditioned vehicles waiting just for you.
            </p>
            <div className="ptp-features">
              {[
                { icon: '🛡', text: 'Vetted, professional drivers' },
                { icon: '❄️', text: 'Air-conditioned fleet' },
                { icon: '📍', text: 'Door-to-door service' },
              ].map(f => (
                <div key={f.text} className="ptp-feature">
                  <div className="ptp-feature-icon">
                    <span style={{ fontSize: '13px' }}>{f.icon}</span>
                  </div>
                  {f.text}
                </div>
              ))}
            </div>
            <div>
              <Link to="/tour-booking/point" style={{ textDecoration: 'none' }}>
                <button className="ptp-btn">
                  <span>Book a Transfer</span>
                  <svg className="ptp-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Point;
