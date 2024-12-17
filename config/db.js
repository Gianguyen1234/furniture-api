const mongoose = require('mongoose');

module.exports = async () => {
  try {
    // No need for deprecated options in Mongoose 6+ or 8+
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit the application if DB connection fails
  }
};

