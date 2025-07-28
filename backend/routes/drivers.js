// backend/routes/drivers.js
const express = require('express');
const router = express.Router();
const { 
  getDrivers, 
  getDriverById, 
  updateDriverLocation, 
  updateDriverStatus,
  protectDriver
} = require('../controllers/driverController');

// Public routes
router.route('/').get(getDrivers);
router.route('/:id').get(getDriverById);

// Private routes
router.route('/location').put(protectDriver, updateDriverLocation);
router.route('/status').put(protectDriver, updateDriverStatus);

module.exports = router;