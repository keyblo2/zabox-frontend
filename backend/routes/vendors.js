// backend/routes/vendors.js
const express = require('express');
const router = express.Router();
const { getVendors, getVendorById, createVendor, protectVendor } = require('../controllers/vendorController');

// Public routes
router.route('/').get(getVendors);
router.route('/:id').get(getVendorById);

// Private routes
router.route('/').post(protectVendor, createVendor); // <-- استخدام الـ middleware

module.exports = router;