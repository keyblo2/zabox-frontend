// backend/models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  vehicle: {
    type: {
      type: String,
      enum: ['motorcycle', 'car', 'bicycle'],
      required: true
    },
    plateNumber: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      trim: true
    }
  },
  license: {
    number: { type: String, required: true },
    expiryDate: { type: Date, required: true }
  },
  status: {
    type: String,
    enum: ['available', 'delivering', 'offline', 'pending'],
    default: 'pending'
  },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  totalDeliveries: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
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

// تحديث `updatedAt` كل مرة البيانات تتعدل
driverSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Driver', driverSchema);