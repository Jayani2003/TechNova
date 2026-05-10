import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useBookings } from '../../../../context/BookingsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { buildApiUrl } from '../../../../config/api';

const MyReviews = ({ isEmbedded = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCustomerBookings, bookings } = useBookings();
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const userEmail = user?.email;

  // Refresh reviews function
  const refreshReviews = useCallback(async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(buildApiUrl('/reviews'));
      if (!res.ok) {
        throw new Error(`Failed to load reviews (${res.status})`);
      }
      const data = await res.json();
      if (data.reviews && userEmail) {
        const userRevs = data.reviews.filter(r => 
          r.user?.email === userEmail || r.user?.name === user?.name
        );
        setMyReviews(userRevs);
      }
    } catch (e) {
      console.warn('Failed to refresh reviews:', e.message);
    }
  }, [userEmail, user?.name]);

  // Fetch customer bookings on mount
  useEffect(() => {
    if (userEmail) {
      getCustomerBookings();
    }
  }, [userEmail, getCustomerBookings]);

  // Get user's bookings from context state
  const userBookings = useMemo(() => {
    return bookings && Array.isArray(bookings) ? bookings : [];
  }, [bookings]);

  // Get completed tours (both reviewed and not reviewed)
  const completedTours = useMemo(() => {
    return userBookings.filter(b => b.status === 'COMPLETED');
  }, [userBookings]);

  // Get completed tours not yet reviewed
  const completedNotReviewed = useMemo(() => {
    const reviewedIds = new Set(myReviews.map(r => r.bookingId).filter(Boolean));
    return completedTours.filter(b => !reviewedIds.has(b.id));
  }, [completedTours, myReviews]);

  // Load user's published reviews on mount
  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        await refreshReviews();
      } finally {
        setLoading(false);
      }
    };
    if (userEmail) loadReviews();
  }, [userEmail, user?.name]);

  // Auto-refresh reviews when component becomes visible (for embedded mode)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && userEmail) {
        refreshReviews();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [userEmail]);

  // Listen for app-wide review updates (dispatched after submit)
  useEffect(() => {
    const handler = () => {
      refreshReviews();
      if (userEmail) {
        getCustomerBookings();
      }
    };
    window.addEventListener('reviews:updated', handler);
    return () => window.removeEventListener('reviews:updated', handler);
  }, [userEmail, refreshReviews, getCustomerBookings]);

  return (
    <>
      <style>{`
        .mr-wrap {
          ${isEmbedded ? 'padding: 24px; background: transparent;' : 'max-width: 1200px; margin: 0 auto; padding: 24px; min-height: 100vh; background: #f7fffe;'}
        }

        .mr-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .mr-title {
          font-size: 28px; font-weight: 800;
          color: #0d2b2b; letter-spacing: -0.02em;
        }

        .mr-back-btn {
          ${isEmbedded ? 'display: none;' : 'padding: 10px 20px; border-radius: 10px; border: 1.5px solid rgba(0,176,165,0.3); background: transparent; color: #00b0a5; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease;'}
        }
        .mr-back-btn:hover {
          background: rgba(0,176,165,0.08);
          border-color: #00b0a5;
        }

        /* Notification section */
        .mr-section {
          margin-bottom: 40px;
        }
        .mr-section-title {
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #3a5a5a;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(0,176,165,0.15);
        }

        .mr-notification-card {
          background: linear-gradient(135deg, rgba(0,176,165,0.06), rgba(0,220,205,0.04));
          border: 1.5px solid rgba(0,176,165,0.25);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .mr-notification-card:hover {
          background: linear-gradient(135deg, rgba(0,176,165,0.1), rgba(0,220,205,0.08));
          border-color: #00b0a5;
          box-shadow: 0 4px 16px rgba(0,176,165,0.15);
        }

        .mr-notif-icon {
          font-size: 28px; flex-shrink: 0;
        }
        .mr-notif-text {
          flex: 1;
        }
        .mr-notif-title {
          font-size: 14px; font-weight: 700;
          color: #0d2b2b;
          margin-bottom: 4px;
        }
        .mr-notif-subtitle {
          font-size: 12px; color: #5a8080;
          font-weight: 400;
        }

        .mr-cta-btn {
          padding: 10px 18px; border-radius: 8px;
          background: #00b0a5; color: #fff;
          border: none;
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .mr-cta-btn:hover {
          background: #009e94;
          transform: translateY(-1px);
        }

        .mr-cta-btn.reviewed {
          background: #c0d8d5;
          color: #3a5a5a;
          cursor: not-allowed;
        }
        .mr-cta-btn.reviewed:hover {
          background: #c0d8d5;
          transform: none;
        }

        /* Reviews grid */
        .mr-reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .mr-review-card {
          background: #fff;
          border: 1px solid rgba(0,176,165,0.1);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,60,50,0.05);
        }
        .mr-review-card:hover {
          box-shadow: 0 8px 24px rgba(0,60,50,0.12);
          transform: translateY(-2px);
        }

        .mr-review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }
        .mr-review-title {
          font-size: 14px; font-weight: 800;
          color: #0d2b2b;
          line-height: 1.4;
          flex: 1;
        }
        .mr-review-stars {
          display: flex; gap: 2px;
        }
        .mr-review-star {
          width: 14px; height: 14px;
        }

        .mr-review-meta {
          font-size: 11px; color: #7a9a9a;
          display: flex; gap: 8px; flex-wrap: wrap;
        }

        .mr-review-comment {
          font-size: 13px; font-weight: 300;
          color: #4a7070; line-height: 1.6;
          max-height: 80px; overflow: hidden;
        }

        .mr-review-images {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .mr-review-image {
          width: 72px;
          height: 56px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid rgba(0,176,165,0.12);
        }

        .mr-empty {
          text-align: center; padding: 60px 24px;
          display: flex; flex-direction: column;
          align-items: center; gap: 16px;
        }
        .mr-empty-icon { font-size: 48px; }
        .mr-empty-title {
          font-size: 1.1rem; font-weight: 800;
          color: #0d2b2b;
        }
        .mr-empty-subtitle {
          font-size: 13px; color: #5a8080;
          max-width: 360px; line-height: 1.6;
        }

        .mr-empty-cta {
          margin-top: 16px;
          padding: 12px 28px; border-radius: 10px;
          background: #00b0a5; color: #fff;
          border: none;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mr-empty-cta:hover {
          background: #009e94;
          transform: translateY(-1px);
        }

        .mr-loading {
          text-align: center; padding: 40px 24px;
          font-size: 14px; color: #5a8080;
        }

        @media(max-width: 768px) {
          .mr-wrap { padding: 16px; }
          .mr-header { flex-direction: column; align-items: flex-start; }
          .mr-title { font-size: 22px; }
          .mr-reviews-grid { grid-template-columns: 1fr; }
          .mr-notification-card { flex-direction: column; align-items: flex-start; }
          .mr-cta-btn { width: 100%; }
        }
      `}</style>

      <div className="mr-wrap">
        {/* Header */}
        <div className="mr-header">
          <h1 className="mr-title">My Reviews</h1>
          <button className="mr-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>

        {/* Notification Section: All Completed Tours */}
        {completedTours.length > 0 && (
          <div className="mr-section">
            <h2 className="mr-section-title">Your Completed Tours</h2>
            <AnimatePresence>
              {completedTours.map((tour, i) => {
                const isReviewed = myReviews.some(r => r.bookingId === tour.id);
                return (
                  <motion.div
                    key={tour.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="mr-notification-card"
                  >
                    <div className="mr-notif-icon">{isReviewed ? '✅' : '🎉'}</div>
                    <div className="mr-notif-text">
                      <div className="mr-notif-title">
                        {tour.packageTitle || `${tour.tourType || 'Tour'} Completed`}
                      </div>
                      <div className="mr-notif-subtitle">
                        {isReviewed 
                          ? 'You have already shared your review for this tour.'
                          : 'You completed this tour. Share your experience!'}
                      </div>
                    </div>
                    <button
                      className={`mr-cta-btn ${isReviewed ? 'reviewed' : ''}`}
                      onClick={() => !isReviewed && navigate('/reviews')}
                      disabled={isReviewed}
                    >
                      {isReviewed ? '✓ Already Reviewed' : 'Write Review'}
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* My Reviews Section */}
        <div className="mr-section">
          <h2 className="mr-section-title">
            Published Reviews ({myReviews.length})
          </h2>

          {loading ? (
            <div className="mr-loading">Loading your reviews...</div>
          ) : myReviews.length === 0 ? (
            <div className="mr-empty">
              <div className="mr-empty-icon">⭐</div>
              <div className="mr-empty-title">No reviews yet</div>
              <div className="mr-empty-subtitle">
                Once you complete a tour, you'll be able to share your experience and help others plan their journey.
              </div>
              {completedNotReviewed.length > 0 && (
                <button
                  className="mr-empty-cta"
                  onClick={() => navigate('/reviews')}
                >
                  Write Your First Review
                </button>
              )}
            </div>
          ) : (
            <div className="mr-reviews-grid">
              <AnimatePresence>
                {myReviews.map((review, i) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="mr-review-card"
                  >
                    <div className="mr-review-header">
                      <div className="mr-review-title">{review.title}</div>
                      <div className="mr-review-stars">
                        {[1, 2, 3, 4, 5].map(s => (
                          <svg
                            key={s}
                            className="mr-review-star"
                            viewBox="0 0 18 18"
                            fill={s <= review.stars ? '#00b0a5' : 'none'}
                            stroke={s <= review.stars ? '#00b0a5' : '#c0d8d5'}
                            strokeWidth="1.5"
                          >
                            <path d="M9 1.5l2.1 4.3 4.7.7-3.4 3.3.8 4.7L9 12.1l-4.2 2.4.8-4.7-3.4-3.3 4.7-.7L9 1.5z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div className="mr-review-meta">
                      <span>{review.tourType}</span>
                      <span>•</span>
                      <span>{review.datePublished}</span>
                      {review.driverName && (
                        <>
                          <span>•</span>
                          <span>Driver: {review.driverName}</span>
                        </>
                      )}
                    </div>

                    <div className="mr-review-comment">{review.comment}</div>

                    {review.images?.length > 0 && (
                      <div className="mr-review-images">
                        {review.images.slice(0, 4).map((image, imageIndex) => (
                          <img
                            key={`${review.id}-${imageIndex}`}
                            src={image}
                            alt={`Review image ${imageIndex + 1}`}
                            className="mr-review-image"
                          />
                        ))}
                        {review.images.length > 4 && (
                          <div style={{ fontSize: '11px', color: '#7a9a9a', alignSelf: 'center' }}>
                            +{review.images.length - 4} more
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyReviews;