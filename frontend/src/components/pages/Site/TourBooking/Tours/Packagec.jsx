import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Packagec = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) card.classList.add('pkg-visible'); },
      { threshold: 0.15 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .pkg-card {
          opacity: 0;
          transform: translateY(48px);
          transition: opacity 0.9s cubic-bezier(0.22,1,0.36,1), transform 0.9s cubic-bezier(0.22,1,0.36,1);
        }
        .pkg-card.pkg-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .pkg-img-wrap {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 32px 80px -12px rgba(0,31,41,0.38), 0 0 0 1px rgba(255,255,255,0.12);
        }
        .pkg-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0,95,115,0.22) 0%, rgba(10,147,150,0.10) 100%);
          pointer-events: none;
        }
        .pkg-img-wrap img {
          width: 100%;
          height: 380px;
          object-fit: cover;
          display: block;
          transition: transform 0.8s cubic-bezier(0.22,1,0.36,1);
        }
        .pkg-img-wrap:hover img {
          transform: scale(1.06);
        }
        .pkg-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.28);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          padding: 7px 16px;
          border-radius: 100px;
          z-index: 2;
        }
        .pkg-tag-count {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background: rgba(0,18,25,0.72);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.15);
          color: #94d2bd;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 12px;
          z-index: 2;
        }
        .pkg-eyebrow {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #0a9396;
        }
        .pkg-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.4rem, 4vw, 3.2rem);
          font-weight: 700;
          color: #001219;
          line-height: 1.1;
          letter-spacing: -0.5px;
        }
        .pkg-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 15.5px;
          font-weight: 300;
          color: #4a6471;
          line-height: 1.8;
        }
        .pkg-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #0a9396, #94d2bd);
          border-radius: 2px;
        }
        .pkg-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pkg-feature {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: #4a6471;
        }
        .pkg-feature-dot {
          width: 6px;
          height: 6px;
          background: #0a9396;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pkg-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, #005f73 0%, #0a9396 100%);
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
          box-shadow: 0 8px 32px -4px rgba(0,95,115,0.45);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          overflow: hidden;
        }
        .pkg-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a9396 0%, #94d2bd 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .pkg-btn:hover::before { opacity: 1; }
        .pkg-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 48px -4px rgba(0,95,115,0.55);
        }
        .pkg-btn span { position: relative; z-index: 1; }
        .pkg-btn-arrow {
          position: relative;
          z-index: 1;
          transition: transform 0.3s ease;
        }
        .pkg-btn:hover .pkg-btn-arrow { transform: translateX(4px); }
      `}</style>

      <div ref={cardRef} className="pkg-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '56px', alignItems: 'center' }}>
        {/* Image */}
        <div className="pkg-img-wrap">
          <div className="pkg-badge">Tour Packages</div>
          <img
            src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800"
            alt="Tour Packages"
          />
          <div className="pkg-tag-count">12 Curated Itineraries</div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="pkg-eyebrow">Handpicked Journeys</div>
          <h2 className="pkg-title">Tour<br />Packages</h2>
          <div className="pkg-divider" />
          <p className="pkg-desc">
            Choose from our expertly crafted itineraries. From the Hill Country mist to the
            Golden Beaches, our fixed packages offer the best value with a dedicated driver.
          </p>
          <div className="pkg-features">
            {['Dedicated personal driver', 'All-inclusive pricing', 'Flexible departure times'].map(f => (
              <div key={f} className="pkg-feature">
                <div className="pkg-feature-dot" />
                {f}
              </div>
            ))}
          </div>
          <div>
            <Link to="/tour-booking/package" style={{ textDecoration: 'none' }}>
              <button className="pkg-btn">
                <span>Explore Packages</span>
                <svg className="pkg-btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Packagec;
