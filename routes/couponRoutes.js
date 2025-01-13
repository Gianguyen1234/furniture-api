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

router.post('/', authMiddleware, roleMiddleware('admin'), createCoupon); // Admin creates a coupon
router.get('/', authMiddleware, roleMiddleware('admin'), getAllCoupons); // Admin fetches all coupons
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteCoupon); // Admin deletes a coupon
router.get('/promotions', getActivePromotions); // Get active promotions
router.post('/apply', authMiddleware, applyCoupon); // Apply a coupon

module.exports = router;
