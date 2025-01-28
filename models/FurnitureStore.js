// models/FurnitureStore.js
const mongoose = require('mongoose');

const FurnitureStoreSchema = new mongoose.Schema({
  logo: { type: String, required: true }, // URL to the store's logo
  web: { type: String }, // Store's website URL
  name: { type: String, required: true, unique: true }, // Unique store name
  rate: { type: String, default: 0 }, // Average rating (e.g., 1-5 scale)
  review: { type: Number, default: 0 }, // Total number of reviews
  location: { type: String, required: false }, // Store's physical location
  field: { type: String, required: true }, // Field of expertise (e.g., "Furniture Design")
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('FurnitureStore', FurnitureStoreSchema);
