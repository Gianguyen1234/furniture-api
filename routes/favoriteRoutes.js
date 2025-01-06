const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');

// Add a product to favorites
router.post('/', favoriteController.addFavorite);

// Get all favorite products for a user
router.get('/:userId', favoriteController.getFavoritesByUser);

// Remove a product from favorites
router.delete('/', favoriteController.removeFavorite);

module.exports = router;
