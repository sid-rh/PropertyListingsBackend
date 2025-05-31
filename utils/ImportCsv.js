const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const Property = require('../models/Property');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const filePath = path.join(__dirname, '../propertyListings.csv');

const importData = async () => {
  try {
    const results = [];
    
    // Read and parse CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          // Transform CSV data to match Property model
          const properties = results.map(row => ({
            propertyId: row.id,
            title: row.title,
            type: row.type,
            price: Number(row.price),
            state: row.state,
            city: row.city,
            areaSqFt: Number(row.areaSqFt),
            bedrooms: Number(row.bedrooms),
            bathrooms: Number(row.bathrooms),
            amenities: row.amenities ? row.amenities.split('|') : [],
            furnished: row.furnished,
            availableFrom: new Date(row.availableFrom),
            listedBy: row.listedBy,
            tags: row.tags ? row.tags.split('|') : [],
            colorTheme: row.colorTheme,
            rating: Number(row.rating),
            isVerified: row.isVerified === 'True',
            listingType: row.listingType,
            createdBy: row.createdBy || '683a9d79f87e1d90c23592ad' //admin id
          }));

          // Delete existing properties
          await Property.deleteMany();

          // Insert new properties
          await Property.insertMany(properties);

          console.log('Data import successful');
          process.exit();
        } catch (error) {
          console.error('Error importing data:', error);
          process.exit(1);
        }
      });
  } catch (error) {
    console.error('Error reading CSV:', error);
    process.exit(1);
  }
};

importData();