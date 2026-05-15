import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useBookings } from '../../../../context/BookingsContext';
import ReviewHero       from './ReviewHero';
import ReviewStats      from './ReviewStats';
import ReviewGrid       from './ReviewGrid';
import ReviewFormModal  from './ReviewFormModal';
import { getCountryFlag } from './countryFlags';
import {
  fetchPublishedReviews,
  fetchReviewStats,
  fetchReviewableTours,
  createReview,
} from './reviewsApi';

const Reviews = () => {
  const { user } = useAuth();
  const { getCustomerBookings } = useBookings();
  const navigate     = useNavigate();
  const [reviews, setReviews]       = useState([]);
  const [filters, setFilters] = useState({ stars: 'All', tourType: '', sort: 'newest' });
  const [stats, setStats] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [serverReviewableTours, setServerReviewableTours] = useState([]);
  const [modalOpen, setModalOpen]   = useState(false);

  const isLoggedIn = Boolean(user);

  useEffect(() => {
    let cancelled = false;

    const loadUserBookings = async () => {
      if (!user?.email) {
        setUserBookings([]);
        return;
      }

      try {
        const bookings = await getCustomerBookings();
        if (!cancelled) {
          setUserBookings(Array.isArray(bookings) ? bookings : []);
        }
      } catch (e) {
        console.warn('Failed to load customer bookings for reviews:', e.message);
        if (!cancelled) setUserBookings([]);
      }
    };

    loadUserBookings();

    return () => {
      cancelled = true;
    };
  }, [getCustomerBookings, user?.email]);

  const reviewedBookingIds = useMemo(
    () => new Set(reviews.map((r) => r.bookingId).filter(Boolean)),
    [reviews]
  );

  const reviewableTours = useMemo(
    () => userBookings
      .filter((b) => b.status === 'COMPLETED' && !reviewedBookingIds.has(b.id))
      .map((b) => ({
        id: b.id,
        packageTitle: b.packageTitle || b.packageName || `${b.tourType || 'Tour'} Booking`,
        packageType: b.tourType || 'Tour',
        completedDate: b.completedAt || b.updatedAt || b.createdAt || '',
      })),
    [reviewedBookingIds, userBookings]
  );

  const effectiveReviewableTours = serverReviewableTours.length
    ? serverReviewableTours
    : reviewableTours;

  useEffect(() => {
    let cancelled = false;

    const loadFromServer = async () => {
      try {
        const serverReviews = await fetchPublishedReviews(filters);
        if (!cancelled && Array.isArray(serverReviews)) {
          setReviews(serverReviews.length ? serverReviews : []);
        }
      } catch (e) {
        console.warn('Failed to load reviews:', e.message);
      }
    };

    loadFromServer();
    return () => {
      cancelled = true;
    };
  }, []);

  // Reload when filters change
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const serverReviews = await fetchPublishedReviews(filters);
        if (!cancelled && Array.isArray(serverReviews)) {
          setReviews(serverReviews);
        }
      } catch (e) {
        console.warn('Filter load failed, keeping existing reviews:', e.message);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    const loadStats = async () => {
      try {
        const s = await fetchReviewStats();
        if (!cancelled) setStats(s);
      } catch (e) {
        console.warn('Failed to load review stats:', e.message);
      }
    };
    loadStats();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!user?.email) {
      setServerReviewableTours([]);
      return;
    }

    const loadTours = async () => {
      try {
        const tours = await fetchReviewableTours(user.email);
        if (!cancelled) setServerReviewableTours(tours);
      } catch (e) {
        console.warn('Using local reviewable tours fallback:', e.message);
        if (!cancelled) setServerReviewableTours([]);
      }
    };

    loadTours();
    return () => {
      cancelled = true;
    };
  }, [user?.email]);

  const handleAddReview = () => {
    if (!isLoggedIn) {
      // Redirect to login with return path
      navigate('/login?redirect=/reviews&action=review');
      return;
    }
    setModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    const selectedTour = effectiveReviewableTours.find((t) => t.id === formData.tourId);

    // Build new review object from form data
    const newReview = {
      id: `r-${Date.now()}`,
      bookingId: formData.tourId,
      user: {
        name: user?.name || 'You',
        country: user?.country || 'Sri Lanka',
        countryFlag: getCountryFlag(user?.country),
        avatar: null,
      },
      tourTitle:     selectedTour?.packageTitle || 'Tour Booking',
      tourType:      selectedTour?.packageType || 'Tour',
      stars:         formData.stars,
      driverName:    formData.driverName?.trim() || '',
      title:         formData.title,
      comment:       formData.comment,
      images:        formData.images.map(i => i.preview),
      datePublished: new Date().toISOString().split('T')[0],
      verified:      true,
    };

    try {
      await createReview({
        customerEmail: user?.email,
        bookingId: formData.tourId,
        stars: formData.stars,
        driverName: formData.driverName?.trim() || '',
        title: formData.title,
        comment: formData.comment,
        tourTitle: selectedTour?.packageTitle || 'Tour Booking',
        tourType: selectedTour?.packageType || 'Tour',
        images: formData.images.map((img) => img.file),
      });

      const serverReviews = await fetchPublishedReviews();
      setReviews(serverReviews.length ? serverReviews : [newReview, ...reviews]);
      const tours = user?.email ? await fetchReviewableTours(user.email) : [];
      setServerReviewableTours(tours);
      setModalOpen(false);
      // Notify other parts of the app that reviews updated
      try { window.dispatchEvent(new Event('reviews:updated')); } catch (e) { /* ignore */ }
      return true;
    } catch (e) {
      console.error('Review submit failed:', e);
      // Fallback keeps UX working when backend is unavailable for this request.
      setReviews(prev => [newReview, ...prev]);
      setModalOpen(false);
      try { window.dispatchEvent(new Event('reviews:updated')); } catch (err) { /* ignore */ }
      return true;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fffe' }}>

      {/* Hero */}
      <ReviewHero
        onAddReview={handleAddReview}
        isLoggedIn={isLoggedIn}
      />

      {/* Aggregate stats */}
      <ReviewStats reviews={reviews} stats={stats} />

      {/* Review grid with filters */}
      <ReviewGrid reviews={reviews} filters={filters} setFilters={setFilters} />

      {/* Form modal */}
      <ReviewFormModal
        isOpen={modalOpen}
        isLoggedIn={isLoggedIn}
        reviewableTours={effectiveReviewableTours}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default Reviews;
