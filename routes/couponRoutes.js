const express = require('express');
const {
  createCoupon,
  getAllCoupons,
  applyCoupon,
  deleteCoupon,
  getActivePromotions
} = require('../controllers/couponController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Routes
router.post('/', authMiddleware, roleMiddleware('admin'), createCoupon); // Admin creates a coupon
router.get('/', authMiddleware, roleMiddleware('admin'), getAllCoupons); // Admin fetches all coupons
router.post('/apply', authMiddleware, applyCoupon); // Apply a coupon
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCoupon); // Admin deletes a coupon
router.get('/promotions', getActivePromotions); // Get active promotions

module.exports = router;
