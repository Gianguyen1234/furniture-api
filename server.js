const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
const dbConfig = require('./config/db');
dbConfig();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Add product routes
app.use('/api/orders', orderRoutes); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));