const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  propertyId: {
    type: String,
    required: [true, 'Property ID is required'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required']
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  areaSqFt: {
    type: Number,
    required: [true, 'Area is required']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  furnished: {
    type: String,
    required: true
  },
  availableFrom: {
    type: Date,
    required: true
  },
  listedBy: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  colorTheme: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  listingType: {
    type: String,
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Property', PropertySchema);