const express = require('express');
const {
  createReview,
  getReviewsByProduct,
  deleteReview,
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:productId', authMiddleware, createReview);
router.get('/:productId', getReviewsByProduct);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;
