const Product = require('../models/Product');

// Reduce stock after an order is placed
exports.reduceStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.stock -= quantity;
    await product.save();

    res.status(200).json({ message: 'Stock updated successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error updating stock', error });
  }
};

// Restock items
exports.restock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock += quantity;
    await product.save();

    res.status(200).json({ message: 'Product restocked successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error restocking product', error });
  }
};

// Get products with low stock
exports.getLowStockProducts = async (req, res) => {
  try {
    const { threshold = 5 } = req.query;

    const products = await Product.find({ stock: { $lt: threshold } });
    res.status(200).json({ message: 'Low stock products retrieved', products });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving low stock products', error });
  }
};
