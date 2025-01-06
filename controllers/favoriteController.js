const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// Add a product to favorites
exports.addFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the favorite already exists
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Product is already in favorites' });
    }

    // Add to favorites
    const favorite = new Favorite({ userId, productId });
    await favorite.save();
    res.status(201).json({ message: 'Product added to favorites', favorite });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to favorites', error: error.message });
  }
};

// Get all favorite products for a user
exports.getFavoritesByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const favorites = await Favorite.find({ userId }).populate('productId');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve favorites', error: error.message });
  }
};

// Remove a product from favorites
exports.removeFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  try {
    const favorite = await Favorite.findOneAndDelete({ userId, productId });
    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }
    res.status(200).json({ message: 'Product removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove favorite', error: error.message });
  }
};
