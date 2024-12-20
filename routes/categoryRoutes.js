const express = require('express');
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { searchCategoryByName} = require('../controllers/categoryController');
const router = express.Router();

// Routes
router.post('/', createCategory); // Create a category
router.get('/', getCategories); // Get all categories
router.get('/:id', getCategoryById); // Get a single category
router.put('/:id', updateCategory); // Update a category
router.delete('/:id', deleteCategory); // Delete a category
// Search for a category by name
router.get('/search/:name', searchCategoryByName);

module.exports = router;
