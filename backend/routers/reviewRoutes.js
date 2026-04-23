const express = require('express');
const {
  getPublishedReviews,
  getReviewableTours,
  createReview,
} = require('../controllers/reviewController');

const router = express.Router();

router.get('/', getPublishedReviews);
router.get('/reviewable-tours', getReviewableTours);
router.post('/', createReview);

module.exports = router;
