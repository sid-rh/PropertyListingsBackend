const mongoose = require('mongoose');

const FavouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index to ensure a user can favourite a property only once
FavouriteSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Favourite', FavouriteSchema);