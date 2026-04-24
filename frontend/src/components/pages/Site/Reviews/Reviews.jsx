import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import { useBookings } from '../../../../context/BookingsContext';
import ReviewHero       from './ReviewHero';
import ReviewStats      from './ReviewStats';
import ReviewGrid       from './ReviewGrid';
import ReviewFormModal  from './ReviewFormModal';
import { mockReviews }  from './reviewsData';
import {
  fetchPublishedReviews,
  fetchReviewableTours,
  createReview,
} from './reviewsApi';

const STORAGE_KEY = 'ceylon_reviews';

const loadReviews = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : mockReviews;
  } catch {
    return mockReviews;
  }
};

const saveReviews = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save reviews:', e);
  }
};

const Reviews = () => {
  const { user } = useAuth();
  const { getCustomerBookings } = useBookings();
  const navigate     = useNavigate();
  const [reviews, setReviews]       = useState(loadReviews);
  const [serverReviewableTours, setServerReviewableTours] = useState([]);
  const [modalOpen, setModalOpen]   = useState(false);

  const isLoggedIn = Boolean(user);

  const userBookings = useMemo(() => {
    if (!user?.email) return [];
    return getCustomerBookings(user.email);
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
        const serverReviews = await fetchPublishedReviews();
        if (!cancelled && serverReviews.length) {
          setReviews(serverReviews);
          saveReviews(serverReviews);
        }
      } catch (e) {
        console.warn('Using local reviews fallback:', e.message);
      }
    };

    loadFromServer();
    return () => {
      cancelled = true;
    };
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
        countryFlag: '🏳️',
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
        images: [],
      });

      const serverReviews = await fetchPublishedReviews();
      setReviews(serverReviews.length ? serverReviews : [newReview, ...reviews]);
      saveReviews(serverReviews.length ? serverReviews : [newReview, ...reviews]);
      const tours = user?.email ? await fetchReviewableTours(user.email) : [];
      setServerReviewableTours(tours);
      setModalOpen(false);
      return true;
    } catch (e) {
      console.error('Review submit failed:', e);
      // Fallback keeps UX working when backend is unavailable.
      setReviews(prev => {
        const next = [newReview, ...prev];
        saveReviews(next);
        return next;
      });
      setModalOpen(false);
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
      <ReviewStats reviews={reviews} />

      {/* Review grid with filters */}
      <ReviewGrid reviews={reviews} />

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
