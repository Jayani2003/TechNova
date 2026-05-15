const StarIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill={filled ? '#00b0a5' : 'none'} stroke="#00b0a5" strokeWidth="1.5">
    <path d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.1l-4.2 2.4.8-4.7-3.4-3.3 4.7-.7L9 1.5z"/>
  </svg>
);

const getAggregateStats = (reviews = []) => {
  if (!Array.isArray(reviews) || !reviews.length) return { avg: 0, total: 0, breakdown: {} };
  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + Number(r.stars || 0), 0);
  const avg = (sum / total).toFixed(1);
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const key = Number(r.stars || 0);
    if (breakdown[key] != null) breakdown[key] += 1;
  });
  return { avg, total, breakdown };
};

const ReviewStats = ({ reviews, stats }) => {
  const fallback = getAggregateStats(reviews);
  const avg = stats?.avg ?? fallback.avg;
  const total = stats?.total ?? fallback.total;
  const breakdown = stats?.breakdown ?? fallback.breakdown;

  return (
    <>
      <style>{`
        .rs-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 52px 32px 0;
        }
        @media(max-width:768px){ .rs-wrap { padding: 36px 16px 0; } }

        .rs-card {
          background: #fff;
          border: 1px solid rgba(0,176,165,0.14);
          border-radius: 24px;
          padding: 40px 48px;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 52px;
          align-items: center;
          box-shadow: 0 4px 32px rgba(0,176,165,0.07);
        }
        @media(max-width:768px){
          .rs-card { grid-template-columns: 1fr; gap: 28px; padding: 28px 20px; text-align: center; }
        }

        /* Left — big number */
        .rs-score {
          display: flex; flex-direction: column; align-items: center;
          gap: 8px; min-width: 160px;
        }
        .rs-number {
          font-size: 5rem; font-weight: 800;
          color: #0d2b2b; letter-spacing: -0.05em; line-height: 1;
        }
        .rs-number span { color: #00b0a5; }
        .rs-stars { display: flex; gap: 3px; }
        .rs-total {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #5a8080;
        }

        /* Right — breakdown bars */
        .rs-bars { display: flex; flex-direction: column; gap: 10px; }
        .rs-bar-row {
          display: flex; align-items: center; gap: 12px;
        }
        .rs-bar-label {
          font-size: 11px; font-weight: 700;
          color: #3a5a5a; width: 36px; text-align: right; flex-shrink: 0;
        }
        .rs-bar-track {
          flex: 1; height: 8px; border-radius: 100px;
          background: rgba(0,176,165,0.1); overflow: hidden;
        }
        .rs-bar-fill {
          height: 100%; border-radius: 100px;
          background: linear-gradient(90deg, #00b0a5, #00ddd0);
          transition: width 1s cubic-bezier(0.22,1,0.36,1);
        }
        .rs-bar-count {
          font-size: 11px; font-weight: 600; color: #5a8080;
          width: 24px; flex-shrink: 0;
        }
      `}</style>

      <div className="rs-wrap">
        <div className="rs-card">
          {/* Left */}
          <div className="rs-score">
            <div className="rs-number">
              {avg}<span>/5</span>
            </div>
            <div className="rs-stars">
              {[1,2,3,4,5].map(i => (
                <StarIcon key={i} filled={i <= Math.round(Number(avg))} />
              ))}
            </div>
            <div className="rs-total">{total} Customer Reviews</div>
          </div>

          {/* Right */}
          <div className="rs-bars">
            {[5,4,3,2,1].map(star => {
              const count = breakdown[star] || 0;
              const pct   = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="rs-bar-row">
                  <div className="rs-bar-label">{'★'.repeat(star)}</div>
                  <div className="rs-bar-track">
                    <div className="rs-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="rs-bar-count">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewStats;
