import React, { useState } from 'react';
import ReviewHeader from './ReviewHeader';
import ReviewList from './ReviewList';
import ReviewFormModal from './ReviewFormModal';
import Login from '../../Shared/Login';



const Reviews = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with your Auth context

  const handleAddReviewClick = () => {
    if (isLoggedIn) {
      setIsFormOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Hero / Header Section */}
      <ReviewHeader onAddReview={handleAddReviewClick} />

      {/* Reviews Display */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <ReviewList />
      </div>

      {/* Modals */}
      {isFormOpen && (
        <ReviewFormModal 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={() => {
            alert("Review sent for Admin approval!");
            setIsFormOpen(false);
          }}
        />
      )}
      
      {isLoginOpen && (
        <Login 
          onClose={() => setIsLoginOpen(false)} 
          onLoginSuccess={() => {
            setIsLoggedIn(true);
            setIsLoginOpen(false);
            setIsFormOpen(true);
          }} 
        />
      )}
    </div>
  );
};

export default Reviews;