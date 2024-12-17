const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.productId;  // Now get productId from URL params
  
    // Log input data for debugging
    console.log("Received review data:", { rating, comment, productId });
  
    // Validate input fields
    if (!rating || !comment) {
      console.log("Validation failed: Missing rating or comment.");
      return res.status(400).json({ message: 'Rating and comment are required' });
    }
  
    if (rating < 1 || rating > 5) {
      console.log("Validation failed: Invalid rating value.");
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
  
    try {
      // Validate product existence
      const product = await Product.findById(productId);
      if (!product) {
        console.log("Product not found with id:", productId);
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if user already reviewed
      const alreadyReviewed = await Review.findOne({
        productId,
        user: req.user.id,
      });
      if (alreadyReviewed) {
        console.log("User has already reviewed this product:", req.user.id, productId);
        return res.status(400).json({ message: 'Product already reviewed' });
      }
  
      // Create and save review using only user ID (no need for user name check)
      const review = new Review({
        productId,
        user: req.user.id,  // Store user ID instead of name
        rating,
        comment,
      });
  
      await review.save();
  
      // Update product rating
      const reviews = await Review.find({ productId });
      const avgRating =
        reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;
  
      product.numReviews = reviews.length;
      product.rating = avgRating;
  
      await product.save();
  
      console.log("Review successfully added:", review);
  
      res.status(201).json({ message: 'Review added successfully', review });
    } catch (err) {
      console.log("Server error:", err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Get all reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
exports.getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate(
      'user',
      'name'  // Populating only the 'name' field from the User model
    );

    if (!reviews.length) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin or review owner)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the owner or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete review' });
    }

    await review.deleteOne();
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
