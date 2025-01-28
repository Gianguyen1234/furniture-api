// controllers/furnitureStoreController.js
const FurnitureStore = require('../models/FurnitureStore');

// Create a new furniture store
exports.createFurnitureStore = async (req, res) => {
  const { logo, web, name, rate, review, location, field } = req.body;

  try {
    const existingStore = await FurnitureStore.findOne({ name });
    if (existingStore) {
      return res.status(400).json({ message: 'Furniture store already exists' });
    }

    const store = await FurnitureStore.create({ logo, web, name, rate, review, location, field });
    res.status(201).json({ message: 'Furniture store created successfully', store });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create furniture store', error: error.message });
  }
};

// Get all furniture stores
exports.getAllFurnitureStores = async (req, res) => {
  try {
    const stores = await FurnitureStore.find();
    res.status(200).json(stores);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch furniture stores', error: error.message });
  }
};

// Get a single furniture store by ID
exports.getFurnitureStoreById = async (req, res) => {
  try {
    const store = await FurnitureStore.findById(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Furniture store not found' });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch furniture store', error: error.message });
  }
};

// Update a furniture store
exports.updateFurnitureStore = async (req, res) => {
  try {
    const store = await FurnitureStore.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!store) {
      return res.status(404).json({ message: 'Furniture store not found' });
    }
    res.status(200).json({ message: 'Furniture store updated successfully', store });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update furniture store', error: error.message });
  }
};

// Delete a furniture store
exports.deleteFurnitureStore = async (req, res) => {
  try {
    const store = await FurnitureStore.findByIdAndDelete(req.params.id);
    if (!store) {
      return res.status(404).json({ message: 'Furniture store not found' });
    }
    res.status(200).json({ message: 'Furniture store deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete furniture store', error: error.message });
  }
};
