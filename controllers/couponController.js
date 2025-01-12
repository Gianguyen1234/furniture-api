const Coupon = require('../models/Coupon');
const Product = require('../models/Product');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  const { code, type, value, productIds, category, global, minPurchase, expiry, usageLimit, stackable, exclusions } = req.body;

  try {
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code,
      type,
      value,
      productIds,
      category,
      global,
      minPurchase,
      expiry,
      usageLimit,
      stackable,
      exclusions,
    });

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create coupon', error: error.message });
  }
};

// List all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons', error: error.message });
  }
};

// Apply a coupon
exports.applyCoupon = async (req, res) => {
  const { code, productId, cartTotal, appliedCoupons = [] } = req.body;

  try {
    const coupon = await Coupon.findOne({ code });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    // Validate exclusions
    if (coupon.exclusions && coupon.exclusions.some((excludedCode) => appliedCoupons.includes(excludedCode))) {
      return res.status(400).json({ message: `Coupon ${code} cannot be used with one of the applied coupons.` });
    }

    // Validate stackable
    if (!coupon.stackable) {
      // If the coupon is not stackable, check if there are any already applied coupons
      if (appliedCoupons.length > 0) {
        return res.status(400).json({ message: `Coupon ${code} cannot be combined with other coupons.` });
      }
    } else {
      // If the coupon is stackable, check if any of the applied coupons are not stackable
      const conflictingCoupons = await Coupon.find({
        code: { $in: appliedCoupons },
        stackable: false,
      });

      if (conflictingCoupons.length > 0) {
        return res.status(400).json({
          message: `Coupon ${code} cannot be used because one or more applied coupons are not stackable.`,
        });
      }
    }

    // Validate expiry
    if (coupon.expiry && new Date(coupon.expiry) < new Date()) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // Validate usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Validate minimum purchase
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase of $${coupon.minPurchase} required` });
    }

    // Check if the coupon applies to the product
    if (coupon.productIds.length > 0 && !coupon.productIds.includes(productId)) {
      return res.status(400).json({ message: 'Coupon does not apply to this product' });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (cartTotal * coupon.value) / 100;
    } else if (coupon.type === 'flat') {
      discount = coupon.value;
    }

    const discountedPrice = cartTotal - discount;

    res.status(200).json({
      message: 'Coupon applied successfully',
      discount,
      discountedPrice,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to apply coupon', error: error.message });
  }
};

// Remove a coupon
exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;

  try {
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });

    await coupon.remove();
    res.status(200).json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete coupon', error: error.message });
  }
};

// get active promotions
exports.getActivePromotions = async (req, res) => {
  try {
    const promotions = await Coupon.find({
      expiry: { $gte: new Date() }, // Only include active coupons
    });

    res.status(200).json({ message: 'Active promotions retrieved', promotions });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch promotions', error: error.message });
  }
};
  
