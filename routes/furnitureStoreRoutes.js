// routes/furnitureStoreRoutes.js
const express = require('express');
const {
  createFurnitureStore,
  getAllFurnitureStores,
  getFurnitureStoreById,
  updateFurnitureStore,
  deleteFurnitureStore,
} = require('../controllers/furnitureStoreController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Public Routes
router.get('/', getAllFurnitureStores); // Get all stores
router.get('/:id', getFurnitureStoreById); // Get a specific store

// Admin-only Routes
router.post('/', authMiddleware, roleMiddleware('admin'), createFurnitureStore); // Create a store
router.put('/:id', authMiddleware, roleMiddleware('admin'), updateFurnitureStore); // Update a store
router.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteFurnitureStore); // Delete a store

module.exports = router;
