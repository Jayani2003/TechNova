const StarIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill={filled ? '#00b0a5' : 'none'} stroke="#00b0a5" strokeWidth="1.5">
    <path d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.1l-4.2 2.4.8-4.7-3.4-3.3 4.7-.7L9 1.5z"/>
  </svg>
);

const getAggregateStats = (reviews = []) => {
  if (!Array.isArray(reviews) || !reviews.length) {
    return { total: 0, breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
  }
  const total = reviews.length;
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const key = Number(r.stars || 0);
    if (breakdown[key] != null) breakdown[key] += 1;
  });
  return { total, breakdown };
};

const ReviewStats = ({ reviews, stats }) => {
  const fallback = getAggregateStats(reviews);
  const total = stats?.total ?? fallback.total;
  const breakdown = stats?.breakdown ?? fallback.breakdown;

  const starLabel = (star) => {
    if (star === 1) return 'one star reviews';
    if (star === 2) return 'two star reviews';
    if (star === 3) return 'three star reviews';
    if (star === 4) return 'four star reviews';
    return 'five star reviews';
  };

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
          display: flex;
          flex-direction: column;
          gap: 22px;
          align-items: center;
          box-shadow: 0 4px 32px rgba(0,176,165,0.07);
        }
        @media(max-width:768px){
          .rs-card { gap: 18px; padding: 28px 20px; text-align: center; }
        }

        /* Left — big number */
        .rs-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
        }
        .rs-title {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a8080;
        }
        .rs-total {
          font-size: 28px;
          font-weight: 800;
          color: #0d2b2b;
          letter-spacing: -0.03em;
          line-height: 1;
        }

        /* Breakdown lines */
        .rs-bars { display: flex; flex-direction: column; gap: 14px; width: 100%; }
        .rs-bar-row {
          display: flex; align-items: center; gap: 12px;
        }
        .rs-bar-label {
          font-size: 13px; font-weight: 800;
          color: #0d2b2b; width: 140px; flex-shrink: 0;
          text-align: left;
        }
        .rs-bar-line {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .rs-star-strip {
          display: flex;
          gap: 2px;
          flex-shrink: 0;
        }
        .rs-bar-count {
          font-size: 11px; font-weight: 700; color: #5a8080;
          white-space: nowrap;
        }
      `}</style>

      <div className="rs-wrap">
        <div className="rs-card">
          <div className="rs-header">
            <div className="rs-title">Review summary</div>
            <div className="rs-total">{total} total reviews</div>
          </div>

          <div className="rs-bars">
            {[5,4,3,2,1].map(star => {
              const count = breakdown[star] || 0;
              return (
                <div key={star} className="rs-bar-row">
                  <div className="rs-bar-label">{count} {starLabel(star)}</div>
                  <div className="rs-bar-line">
                    <div className="rs-star-strip">
                      {[1,2,3,4,5].map(i => (
                        <StarIcon key={i} filled={i <= star} />
                      ))}
                    </div>
                    <div className="rs-bar-count">{count}</div>
                  </div>
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
