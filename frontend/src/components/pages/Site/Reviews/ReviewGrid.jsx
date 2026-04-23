import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewCard from './ReviewCard';

const SORT_OPTIONS = [
  { value: 'newest',    label: 'Newest First' },
  { value: 'highest',   label: 'Highest Rated' },
  { value: 'lowest',    label: 'Lowest Rated' },
];

const STAR_FILTERS = ['All', '5', '4', '3', '2', '1'];

const ReviewGrid = ({ reviews }) => {
  const [sort,       setSort]       = useState('newest');
  const [starFilter, setStarFilter] = useState('All');

  const processed = useMemo(() => {
    let list = [...reviews];
    if (starFilter !== 'All') list = list.filter(r => r.stars === Number(starFilter));
    if (sort === 'newest')  list.sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
    if (sort === 'highest') list.sort((a, b) => b.stars - a.stars);
    if (sort === 'lowest')  list.sort((a, b) => a.stars - b.stars);
    return list;
  }, [reviews, sort, starFilter]);

  return (
    <>
      <style>{`
        .rvg-wrap {
          max-width: 1280px; margin: 0 auto;
          padding: 40px 32px 80px;
        }
        @media(max-width:768px){ .rvg-wrap { padding: 28px 16px 60px; } }

        /* Toolbar */
        .rvg-toolbar {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; margin-bottom: 36px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(0,176,165,0.1);
        }
        .rvg-toolbar-label {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: #5a8080; flex-shrink: 0;
        }
        .rvg-star-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 6px 14px; border-radius: 100px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
          border: 1.5px solid rgba(0,176,165,0.22);
          background: transparent; color: #3a5a5a;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rvg-star-btn:hover { border-color: #00b0a5; color: #00b0a5; }
        .rvg-star-btn.active {
          background: #00b0a5; color: #fff;
          border-color: #00b0a5;
          box-shadow: 0 4px 14px rgba(0,176,165,0.35);
        }

        /* Sort select */
        .rvg-sort {
          margin-left: auto;
          padding: 8px 14px; border-radius: 10px;
          font-size: 12px; font-weight: 600; letter-spacing: 0.04em;
          border: 1.5px solid rgba(0,176,165,0.22);
          background: #fff; color: #3a5a5a;
          cursor: pointer; outline: none;
          transition: border-color 0.2s ease;
        }
        .rvg-sort:focus { border-color: #00b0a5; }

        /* Grid */
        .rvg-grid {
          columns: 3;
          column-gap: 24px;
        }
        @media(max-width:1024px){ .rvg-grid { columns: 2; } }
        @media(max-width:640px){  .rvg-grid { columns: 1; } }

        .rvg-item {
          break-inside: avoid;
          margin-bottom: 24px;
        }

        /* Empty */
        .rvg-empty {
          text-align: center; padding: 60px 24px;
          display: flex; flex-direction: column;
          align-items: center; gap: 12px;
        }
        .rvg-empty-icon { font-size: 40px; }
        .rvg-empty-title {
          font-size: 1.2rem; font-weight: 800;
          color: #0d2b2b; letter-spacing: -0.02em;
        }
        .rvg-empty-sub {
          font-size: 14px; font-weight: 300;
          color: #5a8080;
        }

        /* Result count */
        .rvg-count {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #00b0a5;
        }
        .rvg-count span { font-size: 18px; font-weight: 800; color: #0d2b2b; letter-spacing: -0.02em; }
      `}</style>

      <div className="rvg-wrap">
        {/* Toolbar */}
        <div className="rvg-toolbar">
          <span className="rvg-toolbar-label">Stars</span>
          {STAR_FILTERS.map(s => (
            <button
              key={s}
              className={`rvg-star-btn ${starFilter === s ? 'active' : ''}`}
              onClick={() => setStarFilter(s)}
            >
              {s === 'All' ? 'All' : `${'★'.repeat(Number(s))} ${s}`}
            </button>
          ))}
          <span className="rvg-count"><span>{processed.length}</span> reviews</span>
          <select
            className="rvg-sort"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        {processed.length === 0 ? (
          <div className="rvg-empty">
            <div className="rvg-empty-icon">⭐</div>
            <div className="rvg-empty-title">No reviews found</div>
            <div className="rvg-empty-sub">Try adjusting your filters.</div>
          </div>
        ) : (
          <div className="rvg-grid">
            <AnimatePresence>
              {processed.map((review, i) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="rvg-item"
                >
                  <ReviewCard review={review} index={i} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewGrid;
