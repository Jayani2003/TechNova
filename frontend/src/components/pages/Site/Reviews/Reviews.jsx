import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewHero       from './ReviewHero';
import ReviewStats      from './ReviewStats';
import ReviewGrid       from './ReviewGrid';
import ReviewFormModal  from './ReviewFormModal';
import { mockReviews }  from './reviewsData';

// ── In production, get this from your auth context / store ───
// e.g. const { user } = useAuth();
const MOCK_IS_LOGGED_IN = true;   // ← toggle to test auth gate

const Reviews = () => {
  const navigate     = useNavigate();
  const [reviews, setReviews]       = useState(mockReviews);
  const [modalOpen, setModalOpen]   = useState(false);

  const handleAddReview = () => {
    if (!MOCK_IS_LOGGED_IN) {
      // Redirect to login with return path
      navigate('/login?redirect=/reviews&action=review');
      return;
    }
    setModalOpen(true);
  };

  const handleSubmit = (formData) => {
    // Build new review object from form data
    const newReview = {
      id: `r-${Date.now()}`,
      user: {
        // In production these come from the logged-in user's profile
        name: 'You',
        country: 'Your Country',
        countryFlag: '🏳️',
        avatar: null,
      },
      tourTitle:     formData.tourId,   // In production resolve tour title from ID
      tourType:      'Beach Side',       // In production resolve from tour data
      stars:         formData.stars,
      title:         formData.title,
      comment:       formData.comment,
      images:        formData.images.map(i => i.preview),
      datePublished: new Date().toISOString().split('T')[0],
      verified:      true,
    };

    // Prepend new review so it appears first
    setReviews(prev => [newReview, ...prev]);

    // In production: POST to API, then also update user dashboard "My Reviews"
    // await api.post('/reviews', newReview);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7fffe' }}>

      {/* Hero */}
      <ReviewHero
        onAddReview={handleAddReview}
        isLoggedIn={MOCK_IS_LOGGED_IN}
      />

      {/* Aggregate stats */}
      <ReviewStats reviews={reviews} />

      {/* Review grid with filters */}
      <ReviewGrid reviews={reviews} />

      {/* Form modal */}
      <ReviewFormModal
        isOpen={modalOpen}
        isLoggedIn={MOCK_IS_LOGGED_IN}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default Reviews;
