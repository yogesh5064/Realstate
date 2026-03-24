const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  type: { type: String, enum: ['Home', 'Land'], required: true },
  purpose: { type: String, enum: ['Rent', 'Sell'], required: true },
  location: {
    address: String,
    lat: Number,
    lng: Number
  },
  sellerType: { type: String, enum: ['Professional', 'Casual'], required: true },
  sellerPhone: { type: String, required: true }, // WhatsApp ke liye
  images: [String],
  postedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);