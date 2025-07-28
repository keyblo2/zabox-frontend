// backend/models/Order.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true }, // نخزن اسم المنتج وقت الطلب
  price: { type: Number, required: true }, // نخزن السعر وقت الطلب
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  specialRequest: {
    type: String,
    trim: true
  }
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Driver'
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'picked', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'wallet'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  locations: {
    vendor: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    },
    customer: {
      address: { type: String, required: true },
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  timestamps: {
    placed: { type: Date, default: Date.now },
    confirmed: { type: Date },
    preparing: { type: Date },
    ready: { type: Date },
    picked: { type: Date },
    delivered: { type: Date },
    cancelled: { type: Date }
  },
  estimatedDeliveryTime: {
    type: Date
  },
  actualDeliveryTime: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
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
orderSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// تحديث timestamps عند تغيير الحالة
orderSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status) {
    const statusField = this.status;
    if (!this.timestamps[statusField]) {
      this.timestamps[statusField] = new Date();
    }
    // تحديث وقت التسليم الفعلي
    if (statusField === 'delivered') {
      this.actualDeliveryTime = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);