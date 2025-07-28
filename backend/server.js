// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); // <-- ناقص في الملف بتاعك
const PORT = process.env.PORT || 5000; // <-- ناقص في الملف بتاعك

// Import Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendors');
const orderRoutes = require('./routes/orders');
const driverRoutes = require('./routes/drivers');
const uploadRoutes = require('./routes/upload');

// Middleware
app.use(cors());
app.use(express.json()); // علشان يقدر يقرأ JSON

// اتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🟢 Connected to MongoDB'))
  .catch(err => console.error('🔴 MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/', (req, res) => {
  res.json({ message: '🎉 Welcome to Zabox Backend API!' });
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});