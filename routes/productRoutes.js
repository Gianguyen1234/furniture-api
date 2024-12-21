const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware'); 

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), createProduct); // Only admin can create
router.get('/', getProducts); // Public route
router.get('/:id', getProductById); // Public route
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateProduct); // Only admin can update
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteProduct); // Only admin can delete

module.exports = router;
