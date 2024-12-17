const express = require('express');
const {
  createOrder,
  getMyOrders,
  updateOrderToPaid,
} = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, createOrder); // Create new order
router.get('/myorders', authMiddleware, getMyOrders); // Get user orders
router.put('/:id/pay', authMiddleware, updateOrderToPaid); // Mark order as paid

module.exports = router;
