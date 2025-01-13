const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Unique coupon code
  type: { type: String, enum: ['flat', 'percentage'], required: true }, // Discount type
  value: { type: Number, required: true }, // Discount value
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Specific products 
  category: { type: String }, // Apply to a specific category (optional)
  global: { type: Boolean, default: false }, // Apply to all products
  minPurchase: { type: Number, default: 0 }, // Minimum purchase to apply
  expiry: { type: Date }, // Expiry date
  usageLimit: { type: Number }, // Max number of uses
  usedCount: { type: Number, default: 0 }, // Tracks the number of times the coupon has been used
  stackable: { type: Boolean, default: true }, // Indicates if it can be combined with other coupons
  exclusions: [{ type: String }], // Array of coupon codes it cannot be combined with
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
});

module.exports = mongoose.model('Coupon', CouponSchema);
