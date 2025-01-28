require('dotenv').config();
const mongoose = require('mongoose');
const xlsx = require('xlsx');
const FurnitureStore = require('./models/FurnitureStore');
const fs = require('fs');

// Check for file existence
if (!fs.existsSync('./furnitureStores.xlsx')) {
  console.error('Error: File furnitureStores.xlsx not found.');
  process.exit(1);
} else {
  console.log('File furnitureStores.xlsx found. Proceeding with import...');
}

// MongoDB Connection
const dbConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Simplified connection
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

// Import Data from Excel
const importData = async () => {
  try {
    const workbook = xlsx.readFile('./furnitureStores.xlsx'); // Ensure the path is correct
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Preprocess the data to fix the review field
    const sanitizedData = data.map((item) => {
      if (typeof item.review === 'string') {
        item.review = parseInt(item.review.replace(/,/g, ''), 10); // Remove commas and convert to number
      }
      return item;
    });

    // Insert data into MongoDB
    await FurnitureStore.insertMany(sanitizedData);

    console.log('Data Imported Successfully');
    process.exit();
  } catch (error) {
    console.error('Error Importing Data:', error.message);
    process.exit(1);
  }
};

// Execute the Import
dbConfig().then(importData);
