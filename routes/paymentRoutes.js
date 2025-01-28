const express = require('express');
const { processPayment, processPayPalPayment, createPayPalOrder } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Stripe payment processing
router.post('/stripe', authMiddleware, processPayment);
// PayPal payment processing
router.post('/paypal', authMiddleware, processPayPalPayment);
// Create Paypal Order
router.post('/paypal/create', authMiddleware, createPayPalOrder);

module.exports = router;
