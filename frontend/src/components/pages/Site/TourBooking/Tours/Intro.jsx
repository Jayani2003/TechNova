import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    tag: "Package Tours",
    headline: "Golden Triangle",
    sub: "Ancient temples, misty highlands & sun-drenched shores — curated journeys through Sri Lanka's most iconic destinations.",
    image: "https://images.unsplash.com/photo-1594822779091-7726437c5ac1?q=80&w=1355&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    tag: "Customized Tours",
    headline: "Your Perfect Journey",
    sub: "Tell us your dream — we craft a bespoke itinerary with hidden gems, private experiences & expert local guides.",
    image: "https://images.unsplash.com/photo-1579989197111-928f586796a3?q=80&w=1168&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    tag: "Point to Point",
    headline: "Seamless Transfers",
    sub: "Premium air-conditioned vehicles and professional drivers ensure you arrive at every destination in comfort.",
    image: "https://images.unsplash.com/photo-1665849050332-8d5d7e59afb6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const SLIDE_DURATION = 5000;

export default function Intro() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(0);
  const startTimeRef = useRef(Date.now());
  const animatingRef = useRef(false);

  const goTo = (idx) => {
    if (idx === current || animatingRef.current) return;
    animatingRef.current = true;
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setProgress(0);
      startTimeRef.current = Date.now();
      setFading(false);
      animatingRef.current = false;
    }, 700);
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (animatingRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(p);
      if (elapsed >= SLIDE_DURATION) {
        goTo((current + 1) % slides.length);
      }
    }, 30);
    return () => clearInterval(id);
  }, [current]);

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .intro-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .intro-root { font-family: 'DM Sans', sans-serif; }

        /* ─── STATIC INTRO ─── */
        .intro-static {
          background: #090909;
          color: white;
          padding: 32px 7vw 28px;
          position: relative;
          overflow: hidden;
        }
        .intro-static::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(0, 176, 165, 0.08) 0%, rgba(0, 176, 165, 0.18) 100%);
          pointer-events: none;
        }

        .intro-brand {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 14px;
        }
        .intro-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 3vw, 2.1rem);
          font-weight: 700;
          color: white;
          line-height: 1;
        }
        .intro-brand-name span { color: #00b0a5; }
        .intro-brand-divider {
          width: 1px; height: 22px;
          background: rgba(255,255,255,0.2);
          align-self: center;
        }
        .intro-brand-est {
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(255, 255, 255, 0.46);
        }

        .intro-body {
          display: flex;
          align-items: center;
          gap: 32px;
          flex-wrap: wrap;
        }

        .intro-tagline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.92rem, 1.6vw, 1.1rem);
          font-weight: 400;
          line-height: 1.65;
          color: rgba(255,255,255,0.72);
          flex: 1;
          min-width: 220px;
        }
        .intro-tagline em { font-style: italic; color: #00b0a5; }

        .intro-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }
        .intro-pill {
          padding: 6px 16px;
          background: rgba(0, 176, 165, 0.15);
          border: 1px solid rgba(0, 176, 165, 0.35);
          border-radius: 100px;
          font-size: 12px; font-weight: 500; color: #00b0a5;
          white-space: nowrap; cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s;
        }
        .intro-pill:hover {
          background: rgba(0, 176, 165, 0.28);
          border-color: rgba(0, 176, 165, 0.65);
          transform: scale(1.04);
          box-shadow: 0 3px 12px rgba(0, 176, 165, 0.18);
        }

        .intro-rule {
          margin-top: 24px; height: 1px;
          background: linear-gradient(to right, rgba(0, 176, 165, 0.65), rgba(255,255,255,0.04) 55%, transparent);
          
        }

        /* ─── SLIDER ─── */
        .slider-root {
          position: relative;
          height: 70vh;
          overflow: hidden;
          background: #002827;
        }

        .slide-layer {
          position: absolute;
          inset: 0;
          transition: opacity 0.7s ease;
        }
        .slide-layer.visible { opacity: 1; z-index: 1; }
        .slide-layer.hidden  { opacity: 0; z-index: 0; }

        .slide-layer-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          animation: kbZoom 8s ease-out both;
        }
        @keyframes kbZoom {
          from { transform: scale(1.06); }
          to   { transform: scale(1.0); }
        }

        .slide-layer-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to right, rgba(0,18,25,0.82) 0%, rgba(0,18,25,0.40) 55%, rgba(0,18,25,0.10) 100%),
            linear-gradient(to top,   rgba(0,18,25,0.60) 0%, transparent 45%);
        }

        .slide-content {
          position: absolute;
          inset: 0;
          z-index: 5;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 7vw;
          max-width: 660px;
        }

       .slide-tag {
  display: inline-block;
  font-size: 10.5px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase;
  padding: 5px 14px;
  border: 1px solid rgba(0, 176, 165, 0.45);
  border-radius: 100px;
  color: #00b0a5;
  margin-bottom: 18px;
  width: fit-content;
  background: rgba(0, 176, 165, 0.07);
  animation: sUp 0.55s 0.05s both;
}
        .slide-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.2rem, 5.5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          color: white;
          margin-bottom: 14px;
          animation: sUp 0.55s 0.14s both;
        }
        .slide-sub {
  font-size: clamp(0.9rem, 1.6vw, 1.05rem);
  font-weight: 300;
  line-height: 1.78;
  color: rgba(255,255,255,0.72);
  max-width: 460px;
  animation: sUp 0.55s 0.24s both;
}
        @keyframes sUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

.slide-counter {
  position: absolute;
  bottom: 32px; left: 7vw;
  z-index: 10;
  font-size: 13px; font-weight: 400;
  color: rgba(5, 208, 194, 0.82);
  letter-spacing: 0.06em;
  font-family: 'Playfair Display', serif;
}
        .slide-counter strong { color: white; font-size: 20px; font-weight: 600; }

        .slider-nav {
          position: absolute;
          bottom: 28px; right: 7vw;
          z-index: 10;
          display: flex; align-items: center; gap: 18px;
        }
        .nav-tracks { display: flex; gap: 6px; align-items: center; }
        .nav-track-btn {
          background: none; border: none; cursor: pointer;
          padding: 6px 0; display: flex; align-items: center;
        }
        .nav-track {
  width: 30px; height: 2px;
  background: rgba(0, 176, 165, 0.2);
  border-radius: 2px; overflow: hidden;
  transition: width 0.3s;
}
        .nav-track-btn.active .nav-track { width: 46px; }
.nav-track-fill {
  height: 100%; background: #00b0a5;
  border-radius: 2px; transition: width 0.03s linear;
}
.nav-arrows { display: flex; gap: 8px; }
.nav-arrow {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid rgba(0, 176, 165, 0.3);
  background: rgba(0, 176, 165, 0.08);
  backdrop-filter: blur(6px);
  color: white; font-size: 15px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}
.nav-arrow:hover { background: rgba(0, 176, 165, 0.22); border-color: rgba(0, 176, 165, 0.65); }

        @media (max-width: 680px) {
          .intro-body { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
      `}</style>

      <div className="intro-root">

        {/* ── STATIC INTRO ── */}
        <div className="intro-static">
          <div className="intro-brand">
            <div className="intro-brand-name">Ceylon <span>Best</span> Tours</div>
            <div className="intro-brand-divider" />
            <div className="intro-brand-est">Sri Lanka · Est. 2010</div>
          </div>

          <div className="intro-body">
            <p className="intro-tagline">
              Experience the <em>soul of Sri Lanka</em>. We provide premium vehicles
              and expert drivers to guide you through breathtaking landscapes —
              across our three signature journey categories.
            </p>
            <div className="intro-pills">
              <span className="intro-pill">Package Tours</span>
              <span className="intro-pill">Customized Tours</span>
              <span className="intro-pill">Point to Point</span>
            </div>
          </div>

          <div className="intro-rule" />
        </div>

        {/* ── SLIDER — 70vh ── */}
        <div className="slider-root">

          {slides.map((s, i) => (
            <div
              key={s.id}
              className={`slide-layer ${i === current && !fading ? "visible" : "hidden"}`}
            >
              <div
                className="slide-layer-img"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className="slide-layer-overlay" />
            </div>
          ))}

          <div className="slide-content" key={`content-${current}`}>
            <div className="slide-tag">{slide.tag}</div>
            <h2 className="slide-headline">{slide.headline}</h2>
            <p className="slide-sub">{slide.sub}</p>
          </div>

          <div className="slide-counter">
            <strong>0{current + 1}</strong>&nbsp;/&nbsp;0{slides.length}
          </div>

          <div className="slider-nav">
            <div className="nav-tracks">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`nav-track-btn ${i === current ? "active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <div className="nav-track">
                    <div
                      className="nav-track-fill"
                      style={{
                        width: i === current ? `${progress}%` : i < current ? "100%" : "0%",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
            <div className="nav-arrows">
              <button
                className="nav-arrow"
                onClick={() => goTo((current - 1 + slides.length) % slides.length)}
                aria-label="Previous slide"
              >←</button>
              <button
                className="nav-arrow"
                onClick={() => goTo((current + 1) % slides.length)}
                aria-label="Next slide"
              >→</button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
