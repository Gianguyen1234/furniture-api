const express = require('express');
const router = express.Router();
const {
  reduceStock,
  restock,
  getLowStockProducts,
} = require('../controllers/inventoryController');

// Reduce stock
router.post('/reduce', reduceStock);

// Restock items
router.post('/restock', restock);

// Get low-stock products
router.get('/low-stock', getLowStockProducts);

module.exports = router;
